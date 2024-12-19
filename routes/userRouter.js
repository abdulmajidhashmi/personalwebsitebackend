const express  =require('express');
const userRouter = express.Router();
const {login,signup,alluser,oneuserdetail} = require('../controller/userController.js');

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/all',alluser);
userRouter.post('/oneuserdetail',oneuserdetail);


module.exports = userRouter;