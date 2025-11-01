const appointmentModel = require("../model/AppointmentModel");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const userUpdatedModel = require("../model/userUpdatedModel");
const axiosInstance = require('axios');
const crypto = require('crypto');
const GoogleAuthLibrary = require('google-auth-library');
const OTP_API_KEY = process.env.TWOFACTOR_API_KEY;
const OTP_BASE_URL = process.env.TWOFACTOR_BASE_URL;
const OTP_SENDER_ID = process.env.TWOFACTOR_SENDER_ID;


//signup logic
const signup = async (req, res) => {
  const { confirmPassword, ...body } = req.body;
  try {
    if (body.password !== confirmPassword) {
      return res.send({
        success: false,
        message: "resgistration failed",
        data: "password do not match",
      });
    }
    const token = jwt.sign({ number: body.number }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    const data = new userModel(body);
    await data.save();
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.SECURITY,
      maxAge: 2592000000,
    });
    res.send({
      success: true,
      message: "user registered succesfully",
      data: "token send",
    });
  } catch (err) {
    res.send({ success: false, message: "resgistration failed", data: err });
    console.log(err);
  }
};

const login = async (req, res) => {
  const { number, password } = req.body;

  try {
    const data = await userModel.findOne({ number });
    console.log(data);

    if (data.number === number && data.password === password) {
      const token = jwt.sign({ number: number }, process.env.SECRET_KEY, {
        expiresIn: "30d",
      });
      res.cookie("authToken", token, {
        maxAge: 2592000000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.send({
        message: "user found",
        success: true,
        data: "token send",
      });
    } else if (data.number !== number || data.password !== password) {
      return res.send({
        message: "user not found",
        success: false,
        data: "error",
      });
    }
  } catch (err) {
    console.log(err);
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
};

const alluser = async (req, res) => {
  const body = req.cook;

  try {
    const admindata = await userModel
      .findOne({ role: "admin" })
      .select("-password");
    // console.log(admindata);
    //this login for checking admin is not secure please change this later
    if (body.number === admindata.number) {
      const alluserdata = await userModel
        .find({ role: "user" })
        .select("-password");
      // console.log("lets check",alluserdata);

      return res.send({
        success: true,
        message: "data fetched",
        data: alluserdata,
      });
    } else {
      res.send({ success: true, message: "data fetched", data: admindata });
    }
  } catch (err) {
    console.log(err);
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
};

const oneuserdetail = async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    const data = await userModel.findOne({ number: body.number });

    res.send({ message: "user fetched", success: true, data: data.name });
  } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
};

const selfDetail = async (req, res) => {
  const body = req.cook;

  try {
    const userData = await userModel.findOne({ number: body.number }).select("-password");

    res.send({ success: true, message: "user data fethched", data: userData });
  } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
};

const adminData = async (req, res) => {
  try {
    const adminData = await userModel
      .findOne({ role: "admin" })
      .select("-password");
    res.send({ success: true, message: "user data fetched", data: adminData });
  } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
};

const allAdminData = async (req, res) => {
  try {
    const appointmentdata = await appointmentModel
      .find()
      .populate("user", "name number");
    const totalpatientdata = await userModel
      .find({ role: "user" })
      .select("-password");

    const dataObj = {
      totalpatientdata: totalpatientdata,
      appointmentdata: appointmentdata,
    };

    res.send({ success: true, message: "data fetched", data: dataObj });
  } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
};


const loginWithOtp = async (req, res) => {

  try {
    const { phone, type } = req.body;

    function generateSecureOTP(length = 6) {
      const max = Math.pow(10, length) - 1;
      const min = Math.pow(10, length - 1);
      const range = max - min + 1;

      let randomBytes;
      let randomValue;

      do {
        randomBytes = crypto.randomBytes(4);
        randomValue = randomBytes.readUInt32BE(0);
      } while (randomValue >= Math.floor(0x100000000 / range) * range);

      return (min + (randomValue % range)).toString();
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Enter 10-digit Indian mobile number'
      });
    }

    const otp = generateSecureOTP(6);

      const response = await axiosInstance.get(`${OTP_BASE_URL}/${OTP_API_KEY}/SMS/${phone}/${otp}/OTP1`);
    // const response = {
    //   data: {
    //     Status: "Success"
    //   }
    // }
    if (response.data.Status === 'Success') {
      console.log(response.data);
      res.send({
        success: true,
        message: "OTP sent",
        data: "otp API is working",
      });
    } else {
      throw new Error(response.data.Details || 'Failed to send SMS');
    }
  } catch (error) {
    console.error('Error sending OTP:', error.response?.data || error.message);
    let errorMessage = 'Failed to send OTP. Please try again.';
    if (error.response?.data?.Details) {
      errorMessage = error.response.data.Details;
    }
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};



const loginVerifyWithOtp = async (req, res) => {

  const { phone, otp, loginMethod } = req.body;


  try {
     const response = await axiosInstance.get(`${OTP_BASE_URL}/${OTP_API_KEY}/SMS/VERIFY3/${phone}/${otp}`);

    // const response = {
    //   data: {
    //     Status: "Success"
    //   }
    // }
    if (response.data.Status === 'Success') {
      await userUpdatedModel.deleteMany({
        $or: [{ phone: null }, { email: null }],
        isProfileComplete: false
      });

      const user = await userUpdatedModel.findOneAndUpdate({ phone }, { $setOnInsert: { phone, loginMethod } }, { new: true, upsert: true })

      if (user.isProfileComplete !== false) {

 const jwtToken = jwt.sign({ phone: user.phone }, process.env.SECRET_KEY, { expiresIn: "30d" });
         res.cookie("authToken", jwtToken, {
        maxAge: 2592000000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      }

      return res.send({ success: true, message: "User Verified", token: null, data: user });

    } else {
      return res.send({
        message: "Wrong OTP",
        success: false,
        data: "Wrong OTP",
      });
    }
  } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
}

const profileCompletion = async (req, res) => {

  const { name, email, phone, isProfileComplete } = req.body;

  try {


    const user = await userUpdatedModel.findOneAndUpdate({ $or: [{ email }, { phone }] }, { $set: { name, phone, email, isProfileComplete } }, { new: true });

    const jwtToken = jwt.sign({ phone: user.phone }, process.env.SECRET_KEY, { expiresIn: "30d" });

          res.cookie("authToken", jwtToken, {
        maxAge: 2592000000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

    return res.send({ success: true, message: "User Verified",  data: user })

  } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
}


const googleLogin = async (req, res) => {

  const { token } = req.body;
  console.log(token)

  const client = new GoogleAuthLibrary.OAuth2Client(process.env.GOOGLE_CLIENT_ID);



  try {


    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload();
    console.log(payload)
    const { email, name, picture } = payload;
    await userUpdatedModel.deleteMany({
      $or: [{ email: null }, { phone: null }],
      isProfileComplete: false
    });
    const phone = null;
    const loginMethod = "google";
    const user = await userUpdatedModel.findOneAndUpdate({ email }, { $set: { loginMethod, picture }, $setOnInsert: { email, name } }, { new: true, upsert: true });
    
    if(user.profileCompletion!==false){
      const jwtToken = jwt.sign({ phone: user.phone }, process.env.SECRET_KEY, { expiresIn: "30d" });
           res.cookie("authToken", jwtToken, {
        maxAge: 2592000000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }
    return res.send({ success: true, message: "user created", data: user })

  } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }

}


const userExtractedData = async(req,res)=>{

  const {phone} =req.cook;
  
  try{

   const userData = await userUpdatedModel.findOne({phone});
console.log(userData)
   res.send({success:true,message:"user data fetched",data:userData});


   } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
}


const deleteToken = async(req,res)=>{

  
  
  try{

  
res.clearCookie("authToken",{
  httpOnly:true,
  secure:true,
  sameSite:"none",
  path:"/"
})
   res.send({success:true,message:"successfully logged out",data:null});


   } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
}
module.exports = {
  signup,
  login,
  alluser,
  oneuserdetail,
  selfDetail,
  adminData,
  allAdminData,
  loginWithOtp,
  loginVerifyWithOtp,
  profileCompletion,
  googleLogin,
  userExtractedData,
  deleteToken
};
