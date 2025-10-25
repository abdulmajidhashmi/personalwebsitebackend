const express  =require('express');
const rateLimit = require('express-rate-limit');
const userRouter = express.Router();
const {login,signup,alluser,oneuserdetail, selfDetail, adminData, allAdminData, loginWithOtp, loginVerifyWithOtp, profileCompletion, googleLogin} = require('../controller/userController.js');
const verifyToken = require('../middlewares/verifyToken.js');
const authenticateToken = require('../middlewares/authentication/authenticateToken.js');
const verifyAdmin = require('../middlewares/authentication/verifyAdmin.js');


const sendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP requests, please try after 15 minutes.' }
});

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/loginWithOtp',sendOtpLimiter,loginWithOtp);
userRouter.post('/loginVerifyWithOtp',loginVerifyWithOtp);
userRouter.post('/profile-completion',profileCompletion);
userRouter.post('/google-login',googleLogin);
userRouter.get('/all',verifyToken,alluser);
userRouter.post('/oneuserdetail',verifyToken,oneuserdetail);
userRouter.get('/check-token',authenticateToken);
userRouter.get('/self-detail',verifyToken,selfDetail);
userRouter.get('/admin-data',verifyToken,adminData);
userRouter.get('/all-admin-data',verifyToken,verifyAdmin,allAdminData);


module.exports = userRouter;