const { body, validationResult } = require('express-validator')
const Category = require('../models/Category');
const Group = require('../models/Group');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

exports.newGroupForm = async (req, res) => {
    const categories = await Category.findAll();
    res.render('newGroup', {
        pageName: 'Nuevo grupo',
        categories
    });
}

const multerConfig = {
    limits: { fileSize : 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'/../public/uploads/groups/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        } 
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null, true) // valid file
        } else {
            cb(new Error('Formato de imágen no válido')); // invalid file
        }
    }
}

const upload = multer(multerConfig).single('image');

exports.loadGroupImage = (req, res, next) => {
    upload(req, res, function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo supera los 100kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message)
            }
            res.redirect('/newGroup');
            return;
        } else {
            return next();
        }
    });
}

exports.newGroup = async (req, res) => {
    
    req.sanitizeBody('name');
    req.sanitizeBody('url');

    const group = req.body;
    group.userId = req.user.id;
    if(req.file){
        group.image = req.file.filename;
    }
    try {
        await Group.create(group);
        req.flash('exito', 'Se creo correctamente el grupo!');
        res.redirect('/admin');
    } catch (error) {
        const sequelizeErrors = error.errors.map( error => error.message);
        req.flash('error', sequelizeErrors);
        res.redirect('/newGroup');
    }
}

exports.editGroupForm = async (req, res) => {
    
    const queries  = [];
    queries.push(Group.findByPk(req.params.groupId));
    queries.push(await Category.findAll())

    const [group, categories] = await Promise.all(queries);

    res.render('editGroup', {
        pageName: `Editar Grupo: ${group.name}`,
        group,
        categories 
    })
}

exports.editGroup = async (req, res, next) => {

    const group = await Group.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });
    if(!group){
        req.flash('error', 'Operación inválida');
        res.redirect('/admin');
        return next();
    }
    const { name, description, categoryId, url } = req.body;
    group.name = name;
    group.description = description;
    group.categoryId = categoryId;
    group.url = url;

    await group.save();
    req.flash('exito', 'Los cambios se guardaron correctamente');
    res.redirect('/admin');

}

exports.editGroupImageForm = async (req, res) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });
    res.render('groupImageForm', {
        pageName: `Editar imágen del grupo: ${group.name}`,
        group
    });
}

exports.editGroupImage = async (req, res, next) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });
    if(!group){
        req.flash('error', 'Operación inválida');
        res.redirect('/admin');
        return next();
    }
    if(req.file && group.image){
        const previousImgPath = __dirname+`/../public/uploads/groups/${group.image}`;
        fs.unlink(previousImgPath, (error) => {
            if(error){
                console.log(error);
            }
            return;
        });
    }
    if(req.file){
        group.image = req.file.filename;
    }
    await group.save();
    req.flash('exito', 'La imágen se guardó correctamente');
    res.redirect('/admin');
}

exports.deleteGroupForm = async (req, res, next) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });
    if(!group){
        req.flash('error', 'Operación inválida');
        res.redirect('/admin');
        return next();
    }
    res.render('deleteGroup', {
        pageName: `Eliminar el grupo ${group.name}`
    });
}

exports.deleteGroup = async (req, res, next) => {
    const group = await Group.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });
    if(!group){
        req.flash('error', 'Operación inválida');
        res.redirect('/admin');
        return next();
    }
    if(group.image){
        const previousImgPath = __dirname+`/../public/uploads/groups/${group.image}`;
        fs.unlink(previousImgPath, (error) => {
            if(error){
                console.log(error);
            }
            return;
        });
    }
    await Group.destroy({
        where: {
            id: req.params.groupId
        }
    });
    req.flash('exito', 'Se eliminó el grupo correctamente');
    res.redirect('/admin');
}