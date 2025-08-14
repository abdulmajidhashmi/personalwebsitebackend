const appointmentModel = require("../model/AppointmentModel");
const userModel = require("../model/userModel");

const appointments =async(req,res)=>{
    const {number,date,time,type,description} =req.body;
    try{
        const userData = await userModel.findOne({number})
        if(!userData){
            return res.send({message:"Internal server error",success:false,data:"not abled to fetch the user"});

        }

        const userfullData  = new appointmentModel({

            user:userData._id,
            date:date,
            time:time,
            type:type,
            description:description
        })
      await userfullData.save();
      

         res.send({message:"appointment scheduled",success:true,data:"appointment created"});

    }catch(err){

        return res.send({message:"Internal server error",success:false,data:err});
    }


}


module.exports  =appointments;