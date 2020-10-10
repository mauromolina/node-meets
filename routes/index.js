const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');
const groupController = require('../controllers/group');
const meetController = require('../controllers/meet');
const meetFrontendController = require('../controllers/frontend/meetController');
const userFrontendController = require('../controllers/frontend/userController');
const groupFrontendController = require('../controllers/frontend/groupController');

module.exports = () => {

    router.get('/', homeController.home);

    router.get('/meet/:slug',
        meetFrontendController.showMeet)

    router.post('/confirmAssistance/:meetSlug',
        meetFrontendController.confirmAssistance)

    router.get('/assistants/:meetSlug',
        meetFrontendController.getMeetAssistants)

    router.get('/users/:id',
        userFrontendController.getUserDetails)

    router.get('/groups/:id',
        groupFrontendController.getGroupDetails);

    router.get('/category/:category', 
        meetFrontendController.getCategoryGroups)

    router.get('/signup', userController.signUpForm);
    router.post('/signup', userController.signUp);
    router.get('/confirmAccount/:email', userController.confirmAccountForm);

    router.get('/login', userController.loginForm);
    router.post('/login', authController.authUser);

    router.get('/logout', 
        authController.isAuth,
        authController.logOut)

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

    router.get('/newMeet',
        authController.isAuth,
        meetController.newMeetForm)
    router.post('/newMeet',
        authController.isAuth,
        meetController.sanitizeInputs,
        meetController.newMeet);

    router.get('/editMeet/:meetId', 
        authController.isAuth,
        meetController.editMeetForm)

    router.post('/editMeet/:meetId', 
        authController.isAuth,
        meetController.editMeet)

    router.get('/deleteMeet/:id', 
        authController.isAuth,
        meetController.deleteMeetForm)

    router.post('/deleteMeet/:id', 
        authController.isAuth,
        meetController.deleteMeet)

    router.get('/editProfile', 
        authController.isAuth,
        userController.editProfileForm)

    router.post('/editProfile',
        authController.isAuth,
        userController.editProfile)

    router.get('/changePassword',
        authController.isAuth,
        userController.changePasswordForm)

    router.post('/changePassword', 
        authController.isAuth,
        userController.changePassword)

    router.get('/profileImage',
        authController.isAuth,
        userController.profileImageForm)
        
    router.post('/profileImage',
        authController.isAuth,
        userController.loadProfileImage,
        userController.saveProfileImage)

    return router;
}