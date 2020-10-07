const { body, validationResult } = require('express-validator')
const Group = require('../models/Group');
const Meet = require('../models/Meet');

exports.newMeetForm = async (req, res) => {
    const groups = await Group.findAll({
        where: {
            userId: req.user.id
        }
    })
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