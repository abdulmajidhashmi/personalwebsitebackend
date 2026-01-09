const userUpdatedModel = require('../../model/userUpdatedModel');
const jwt = require('jsonwebtoken');

const verifyAdmin = async (req,res,next)=>{
    const token =req.cookies.authToken;

     if(!token){

        res.send({success:false,message:"token not found",data:"missing token"}); 
        return;
    }
  
try{
    
    const decode =  jwt.verify(token,process.env.SECRET_KEY);


   const data = await userUpdatedModel.findOne({role:'admin'});

   if(data.phone===decode.phone){
    req.cook = decode;
    next();

   }else{

    res.send({success:false,message:"not a authorised person",data:"error"});
   }
   

}catch(err){

    res.send({success:false,message:"token invalid",data:err});
    console.log("token is invalid");
}
}

module.exports = verifyAdmin;