const express  =require('express');
const userRouter = express.Router();
const {login,signup,alluser,oneuserdetail, selfDetail, adminData} = require('../controller/userController.js');
const verifyToken = require('../middlewares/verifyToken.js');
const authenticateToken = require('../middlewares/authentication/authenticateToken.js');

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/all',verifyToken,alluser);
userRouter.post('/oneuserdetail',verifyToken,oneuserdetail);
userRouter.get('/check-token',authenticateToken);
userRouter.get('/self-detail',verifyToken,selfDetail);
userRouter.get('/admin-data',verifyToken,adminData);


module.exports = userRouter;