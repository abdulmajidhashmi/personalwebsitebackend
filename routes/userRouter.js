const express  =require('express');
const userRouter = express.Router();
const {login,signup,alluser,oneuserdetail, selfDetail, adminData, allAdminData} = require('../controller/userController.js');
const verifyToken = require('../middlewares/verifyToken.js');
const authenticateToken = require('../middlewares/authentication/authenticateToken.js');
const verifyAdmin = require('../middlewares/authentication/verifyAdmin.js');

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/all',verifyToken,alluser);
userRouter.post('/oneuserdetail',verifyToken,oneuserdetail);
userRouter.get('/check-token',authenticateToken);
userRouter.get('/self-detail',verifyToken,selfDetail);
userRouter.get('/admin-data',verifyToken,adminData);
userRouter.get('/all-admin-data',verifyToken,verifyAdmin,allAdminData);


module.exports = userRouter;