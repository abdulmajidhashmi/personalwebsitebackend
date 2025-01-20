const jwt = require('jsonwebtoken');


const verifyToken = (req,res,next)=>{
    const token =req.cookies.authToken;
    

    if(!token){

        res.send({success:false,message:"token not found",data:"please send the token"}); 
        return;
    }
try{

   const decode =  jwt.verify(token,process.env.SECRET_KEY);
   req.cook = decode;
   next();

}catch(err){

    res.send({success:false,message:"token invalid",data:err});
    console.log("token is invalid");
}
}

module.exports = verifyToken;