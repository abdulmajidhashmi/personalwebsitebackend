const userModel = require("../../model/userModel");

const verifyAdmin = async (req,res,next)=>{
    const body=req.cook;

    console.log(body);
try{
    
   
   const data = await userModel.findOne({role:'admin'});

   if(data.number===body.number){
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