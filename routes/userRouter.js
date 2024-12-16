const express  =require('express');
const userRouter = express.Router();
const {login,signup,alluser} = require('../controller/userController.js');

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/all',alluser);


module.exports = userRouter;