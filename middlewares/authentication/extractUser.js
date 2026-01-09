const userUpdatedModel = require("../../model/userUpdatedModel");

const extractUser= async (req,res)=>{
    const body=req.cook;
try{
    
   const data = await  userUpdatedModel.findOne({phone:body.phone});

 res.send({success:true,message:"valid token",data:data});
  
   

}catch(err){

    res.send({success:false,message:"token invalid",data:err});
    console.log("token is invalid");
}
}

module.exports = extractUser;