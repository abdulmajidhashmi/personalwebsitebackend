const userModel = require('../model/userModel');
const signup = async(req,res)=>{



    const {confirmPassword,...body} = req.body;

    try{

        if(body.password!==confirmPassword){

            return res.send({success:false,message:"resgistration failed",data:"password do not match"});
        }

        const data = new userModel(body);
        await data.save();
        res.send({success:true,message:"user registered succesfully",data:"created"});


    }catch(err){
res.send({success:false,message:"resgistration failed",data:err});
console.log(err);

    }


}

const login = async(req,res)=>{
const {number,password}  =req.body;

try{
const data = await userModel.findOne({number});
console.log(data);

if(data.number===number && data.password === password){

    return res.send({message:"user found",success:true,data:data});
}else if(data.number!==number || data.password !== password){

    return res.send({message:"user not found",success:false,data:"error"});
}

}catch(err){
console.log(err);
    return res.send({message:"Internal server error",success:false,data:err});
}
}

const alluser = async(req,res)=>{
    const body =req.body;

    try{
        const admindata = await userModel.findOne({role:"admin"});
        console.log(admindata);
        //this login for checking admin is not secure please change this later
if(body.number===admindata.number){

    const alluserdata = await userModel.find();
    console.log("lets check",alluserdata);

   return  res.send({success:true,message:"data fetched",data:alluserdata});

}else{

    const obj=[{
        name:"Doctor",
        number:admindata.number,
    }]

    res.send({success:true,message:"data fetched",data:obj});

}
    }
    catch(err){
        console.log(err);
        return res.send({message:"Internal server error",success:false,data:err});

    }

}
module.exports ={signup,login,alluser};