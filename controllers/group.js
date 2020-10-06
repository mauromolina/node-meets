const { body, validationResult } = require('express-validator')
const Category = require('../models/Category');
const Group = require('../models/Group');

exports.newGroupForm = async (req, res) => {
    const categories = await Category.findAll();
    res.render('newGroup', {
        pageName: 'Nuevo grupo',
        categories
    });
}

exports.newGroup = async (req, res) => {
    
    req.sanitizeBody('name');
    req.sanitizeBody('url');

    const group = req.body;
    group.userId = req.user.id;
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