const jwt  = require('jsonwebtoken');


const authenticateToken = (req,res,next)=>{
    const token =req.cookies.authToken;
   

    if(!token){

        res.send({success:false,message:"token not found",data:"please send the token"});
        return; 
    }
try{

   const decode =  jwt.verify(token,process.env.SECRET_KEY);
   res.send({success:true,message:"token verified",data:"token verified"});

}catch(err){

    res.send({success:false,message:"token invalid",data:err});
    console.log("token is invalid");
}
}

module.exports = authenticateToken;