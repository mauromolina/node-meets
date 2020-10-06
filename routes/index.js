const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');
const groupController = require('../controllers/group');

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

    router.get('/newGroup', 
        authController.isAuth,
        groupController.newGroupForm)
    router.post('/newGroup',
        groupController.loadGroupImage,
        groupController.newGroup)

    router.get('/editGroup/:groupId', 
        authController.isAuth,
        groupController.editGroupForm)
    router.post('/editGroup/:groupId', 
        authController.isAuth,
        groupController.editGroup)
    router.get('/groupImage/:groupId', 
        authController.isAuth,
        groupController.editGroupImageForm)
    router.post('/groupImage/:groupId',
        authController.isAuth,
        groupController.loadGroupImage,
        groupController.editGroupImage)

    router.get('/deleteGroup/:groupId',
        authController.isAuth,
        groupController.deleteGroupForm)

    router.post('/deleteGroup/:groupId',
        authController.isAuth,
        groupController.deleteGroup)

    return router;
}