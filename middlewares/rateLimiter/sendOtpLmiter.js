const rateLimit = require('express-rate-limit');

const sendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP requests, please try after 15 minutes.' }
});

module.exports={sendOtpLimiter};