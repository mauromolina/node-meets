const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');

module.exports = () => {

    router.get('/', homeController.home);

    router.get('/signup', userController.signUpForm);
    router.post('/signup', userController.signUp);
    router.get('/confirmAccount/:email', userController.confirmAccountForm);

    router.get('/login', userController.loginForm);
    router.post('/login', authController.authUser);

    router.get('/admin', 
        authController.isAuth,    
        adminController.getAdminPanel);

    return router;
}