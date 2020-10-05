const User = require('../models/User');
const { body, validationResult } = require('express-validator')

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
            req.flash('exito', 'Registro exitoso!');
            res.redirect('/');
        } catch (error) {
            const sequelizeErrors = error.errors.map( error => error.message);
            const errExp = expressErrors.map( error => error.msg);
            const errors = [...sequelizeErrors, ...errExp];
            req.flash('error', errors);
            res.redirect('signup');
        }
    }


}