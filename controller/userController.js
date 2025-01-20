const userModel = require("../model/userModel");
const jwt = require('jsonwebtoken');
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
    const token = jwt.sign({number:body.number},process.env.SECRET_KEY,{expiresIn:'30d'});
    const data = new userModel(body);
    await data.save();
    res.cookie('authToken',token,{

        httpOnly:true,
        secure:process.env.SECURITY,
        maxAge: 2592000000,
    })
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

        const token = jwt.sign({number:number},process.env.SECRET_KEY,{expiresIn:'30d'});
        res.cookie('authToken',token,{

            maxAge: 2592000000,
            httpOnly:true,
            secure:true,
            sameSite:'None'
        })
      return res.send({ message: "user found", success: true, data: "token send" });
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
    const admindata = await userModel.findOne({ role: "admin" }).select('-password');
    // console.log(admindata);
    //this login for checking admin is not secure please change this later
    if (body.number === admindata.number) {
      const alluserdata = await userModel.find({role:"user"}).select('-password');
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
console.log(data);
    res.send({ message: "user fetched", success: true, data: data.name });
  } catch (err) {
    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
};

const selfDetail = async (req,res)=>{

const body  =req.cook;


try{
  const userData = await userModel.findOne({number:body.number});

  res.send({success:true,message:"user data fethched",data:userData});

}catch(err){
  return res.send({
    message: "Internal server error",
    success: false,
    data: err,
  });

}
}


const adminData = async(req,res)=>{

  try{

    const adminData = await userModel.findOne({role:'admin'}).select('-password');
    res.send({success:true,message:"user data fetched",data:adminData});

  }catch(err){

    return res.send({
      message: "Internal server error",
      success: false,
      data: err,
    });
  }
}
module.exports = { signup, login, alluser, oneuserdetail,selfDetail,adminData };
