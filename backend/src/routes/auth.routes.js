const express = require('express');
const authrouter = express.Router();
const authMiddleware=require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');

authrouter.post('/register',authController.registerUserController);
authrouter.post('/login',authController.loginUserController);
authrouter.get('/logout',authController.logoutUserController);
authrouter.get('/get-me',authMiddleware.authUser,authController.getMeContoller);

module.exports=authrouter;