const { body, validationResult } = require('express-validator');
const { user } = require('../config/email');
const Group = require('../models/Group');
const Meet = require('../models/Meet');

exports.newMeetForm = async (req, res, next) => {
    const groups = await Group.findAll({
        where: {
            userId: req.user.id
        }
    })
    console.log(groups);
    if(groups.length === 0){
        req.flash('error', 'Necesitás ser miembro de al menos un grupo para crear un evento');
        res.redirect('/newGroup');
        return next();
    }
    res.render('newMeet', {
        pageName: 'Nuevo evento',
        groups
    })
}

exports.sanitizeInputs = (req, res, next) => {

    req.sanitizeBody('title');
    req.sanitizeBody('guest');
    req.sanitizeBody('quota');
    req.sanitizeBody('date');
    req.sanitizeBody('time');
    req.sanitizeBody('address');
    req.sanitizeBody('city');
    req.sanitizeBody('state');
    req.sanitizeBody('country');
    req.sanitizeBody('lat');
    req.sanitizeBody('lng');
    req.sanitizeBody('groupId');

    next();
}

exports.newMeet = async (req, res) => {
    const meet = req.body;
    meet.userId = req.user.id;
    meet.location = [req.body.lat, req.body.lng];
    if(req.body.quota === ''){
        meet.quota = 0;
    }
    try {
        await Meet.create(meet);
        req.flash('exito', 'El evento se creó correctamente');
        return res.redirect('/admin');
    } catch (error) {
        console.log('como va');
        console.log(error);
        console.log('hao');
        const sequelizeErrors = error.errors.map( error => error.message);
        req.flash('error', sequelizeErrors);
        res.redirect('/newMeet');
    }
    console.log(meet);
}

exports.editMeetForm = async (req, res, next) => {
    const queries = [];
    queries.push(
        await Meet.findByPk(req.params.meetId)
    );
    queries.push(
        await Group.findAll({
            where: {
                userId: req.user.id
            }
        })
    );
    const [ meet, groups ] = await Promise.all(queries);

    if(meet.length === 0 || groups.length === 0) {
        req.flash('error', 'No se encontró el meet que estabas buscando');
        res.redirect('/admin');
        return next();
    }

    res.render('editMeet', {
        pageName: `Editar evento ${meet.title}`,
        meet,
        groups 
    })

}

exports.editMeet = async (req, res, next) => {
    const meet = await Meet.findOne({
        where: {
            id: req.params.meetId,
            userId: req.user.id
        }
    });
    if(meet.length === 0){
        req.flash('error', 'No se encontró el meet que estabas buscando');
        res.redirect('/admin');
        return next();
    }
    const { groupId, title, guest, date, time, description, address, city, state, country, lat, lng}
        = req.body;
    meet.groupId = groupId;
    meet.title = title;
    meet.guest = guest;
    meet.date = date;
    meet.time = time;
    meet.description = description;
    meet.address = address;
    meet.city = city;
    meet.state = state;
    meet.country = country;
    meet.location = [lat, lng];
    await meet.save();
    req.flash('exito', 'El evento se actualizó correctamente');
    res.redirect('/admin')
}

exports.deleteMeetForm = async (req, res, next) => {
    const meet = await Meet.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    });
    if(meet.length === 0){
        req.flash('error', 'Operación inválida');
        res.redirect('/admin');
        return next();
    }
    res.render('deleteMeet', {
        pageName: `Eliminar el evento ${meet.title}`
    })

}

exports.deleteMeet = async (req, res) => {
    const meet = await Meet.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    });
    if(meet.length === 0){
        req.flash('error', 'Operación inválida');
        res.redirect('/admin');
        return next();
    }
    await Meet.destroy({
        where: {
            id: req.params.id
        }
    });
    req.flash('exito', 'Se eliminó el evento correctamente');
    res.redirect('/admin');
}