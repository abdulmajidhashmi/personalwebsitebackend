const express  =require('express');
const userRouter = express.Router();
const {login,signup,alluser,oneuserdetail, selfDetail, adminData, allAdminData, loginWithOtp, loginVerifyWithOtp, profileCompletion, googleLogin, userExtractedData, deleteToken} = require('../controller/userController.js');
const verifyToken = require('../middlewares/authorization/verifyUser.js');
const verifyAdmin = require('../middlewares/authorization/verifyAdmin.js');
const { sendOtpLimiter } = require('../middlewares/rateLimiter/sendOtpLmiter.js');
const verifyUser = require('../middlewares/authorization/verifyUser.js');
const authenticateUser = require('../middlewares/authentication/authenticateUser.js');
const authenticateAdmin = require('../middlewares/authentication/authenticateAdmin.js');
const extractUser = require('../middlewares/authentication/extractUser.js');




userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/loginWithOtp',sendOtpLimiter,loginWithOtp);
userRouter.post('/loginVerifyWithOtp',loginVerifyWithOtp);
userRouter.post('/profile-completion',profileCompletion);
userRouter.post('/google-login',googleLogin);
userRouter.get('/all',verifyAdmin,alluser);
userRouter.post('/oneuserdetail',verifyAdmin,oneuserdetail);
userRouter.get('/check-token',verifyUser,authenticateUser);
userRouter.get('/extract-token',verifyUser,extractUser);
userRouter.get('/check-admin-token',verifyAdmin,authenticateAdmin);
userRouter.get('/fetch-user-data',verifyUser,userExtractedData);
userRouter.get('/self-detail',verifyUser,selfDetail);
userRouter.get('/admin-data',verifyAdmin,adminData);
userRouter.get('/all-admin-data',verifyAdmin,allAdminData);
userRouter.get('/delete-token',deleteToken);


module.exports = userRouter;