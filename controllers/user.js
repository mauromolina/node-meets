const User = require('../models/User');
const { body, validationResult } = require('express-validator')
const sendEmail = require('../handlers/email');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

exports.signUpForm = (req, res) => {
    res.render('signup', {
        pageName: 'Registrarse'
    });
}

exports.signUp = async (req, res) => {

    const emailUser = await User.findOne({  where: { email: req.body.email }});
    if(emailUser){
        req.flash('error', 'Usuario ya registrado');
        res.redirect('/signup');
        return;
    } else {

        const user = req.body;

        req.checkBody('confirm', 'Las contraseñas no coinciden').equals(req.body.password);
        req.checkBody('confirm', 'La confirmación de contraseña es obligatoria').notEmpty();

        const expressErrors = req.validationErrors();

        try {
            const newUser = await User.create(user);

            const url = `http://${req.headers.host}/confirmAccount/${user.email}`;

            await sendEmail.sendEmail({
                user,
                url,
                subject: 'Confirma tu cuenta en Meeti',
                file: 'confirmAccount'
            });
            req.flash('exito', 'Se envió un email de confirmación a tu correo');
            res.redirect('/login');
        } catch (error) {
            console.log(error);
            const sequelizeErrors = error.errors.map( error => error.message);
            const errExp = expressErrors.map( error => error.msg);
            const errors = [...sequelizeErrors, ...errExp];
            req.flash('error', errors);
            res.redirect('signup');
        }
    }
}

exports.confirmAccountForm = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            email: req.params.email
        }
    });
    console.log(user);
    if(!user){
        req.flash('No existe un usuario con esa cuenta');
        res.redirect('/signup')
        return next();
    }
    user.active = 1;
    await user.save();
    req.flash('exito', 'Tu cuenta se confirmó correctamente. Ya podés iniciar sesión')
    res.redirect('/login');
}

exports.loginForm = (req, res) => {
    res.render('login', {
        pageName: 'Iniciar sesión'
    })
}

exports.editProfileForm = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if(user.length === 0){
        req.flash('error', 'Usuario no encontrado');
        res.redirect('/admin');
    }
    console.log('========', user);
    res.render('editProfile', {
        pageName: 'Editar perfil',
        user
    })
}

exports.editProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if(user.length === 0){
        req.flash('error', 'Usuario no encontrado')
        res.redirect('/admin');
    }
    req.sanitizeBody('name');
    const { name, description } = req.body;
    user.name = name;
    user.description = description;
    await user.save();
    req.flash('exito', 'Los cambios se guardaron correctamente');
    res.redirect('/admin'); 
}

exports.changePasswordForm = (req, res) => {
    res.render('changePassword', {
        pageName: 'Cambiar contraseña'
    });
}

exports.changePassword = async (req, res, next) => {
    const user = await User.findByPk(req.user.id);
    if(!user){
        req.flash('error', 'Usuario no encontrado');
        res.redirect('/admin');
    }
    if(!user.validatePassword(req.body.actPass)){
        req.flash('error', 'La contraseña actual es incorrecta');
        res.redirect('/admin');
        return next();
    }
    const hash = user.hashPassword(req.body.newPass);
    user.password = hash;
    await user.save();
    req.logout();
    req.flash('exito', 'La contraseña se actualizó correctamente, por seguridad se cerró tu sesión');
    res.redirect('/admin');
}

const multerConfig = {
    limits: { fileSize : 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'/../public/uploads/profiles/');
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

exports.loadProfileImage = (req, res, next) => {
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
            res.redirect('/editProfile');
            return;
        } else {
            return next();
        }
    });
}

exports.profileImageForm = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    res.render('profileImage', {
        pageName: 'Cambiar foto de perfil',
        user
    })
}

exports.saveProfileImage = async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if(req.file && user.image){
        const previousImgPath = __dirname+`/../public/uploads/profiles/${user.image}`;
        fs.unlink(previousImgPath, (error) => {
            if(error){
                console.log(error);
            }
            return;
        });
    }

    if(req.file){
        user.image = req.file.filename;
    }

    await user.save();
    req.flash('exito', 'Tu foto de perfil se actualizó correctamente');
    res.redirect('/admin')

}