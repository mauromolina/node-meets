const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const userController = require('../controllers/user');

module.exports = () => {
    router.get('/', homeController.home);

    router.get('/signup', userController.signUpForm)

    return router;
}