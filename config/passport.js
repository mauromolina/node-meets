const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use( new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    async (email, password, next) => {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if(!user) return next(null, false, {
            message: 'Usuario incorrecto'
        });
        if(!user.validatePassword(password)) return next(null, false, {
            message: 'Contraseña incorrecta'
        });
        return next(null, user);
        } 
    ))

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(user, cb){
    cb(null, user);
});

module.exports = passport;
