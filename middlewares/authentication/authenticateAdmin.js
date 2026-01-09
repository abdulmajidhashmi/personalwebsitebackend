

const authenticateAdmin= async (req,res)=>{
    const body=req.cook;
try{
    if(body){
   
 res.send({success:true,message:"valid token",data:"authenticated"});


    }

}catch(err){

    res.send({success:false,message:"token invalid",data:err});
    console.log("token is invalid");
}
}

module.exports = authenticateAdmin;