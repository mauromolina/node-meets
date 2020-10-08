const passport = require('passport');

exports.authUser = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Inicia sesión para realizar esta acción')
    return res.redirect('/login');
}

exports.logOut = (req, res, next) => {
    req.logout();
    req.flash('exito', 'Se cerró correctamente tu sesión');
    res.redirect('/login');
    next();
}