const chatModel = require("../model/chatModel");




// const saveChats = async (req, res) => {

//     const body = req.body;
//     console.log(body.message[0].userType, body.message[0].messageText);
//     try {


//         const bodydata = {
//             userPhone: body.userPhone,
//             message: [{ userType: body.message[0].userType, messageText: body.message[0].messageText }]
//         }

//         const chatData = new chatModel(bodydata);
//         const data = await chatData.save();


//         return res.send({ message: "data fetched", success: true, data: data });

//     } catch (err) {
//         return res.send({ message: "Internal server error", success: false, data: err });
//     }


// }

const updateChats = async (req,res) => {

    const {userId,text,userType} =req.body;
  
    try {

        await chatModel.findOneAndUpdate({ userPhone: userId }, { $push: { messages: { userType: userType, text: text } } }, { upsert: true, new: true })


    } catch (err) {
        return res.send({ message: "Internal server error", success: false, data: err });
    }

}

const saveChats = async ({message,userType,userDbId}) => {

  
    try {

       const data = await chatModel.findOneAndUpdate({ userPhone: userDbId }, { $push: { messages: { userType: userType, text: message } } }, { upsert: true, new: true })
       return {success:true,message:"Message saved"}

    } catch (err) {
         console.log(err);
       return {success:false,message:err}
      
    }

}

const getChats = async (req,res) => {

    const {userId} =req.body;
   
  
    try {

       const chatData = await chatModel.findOne({ userPhone: userId })
   
        res.send({success:true,message:"chat messages fetched",data:chatData})

    } catch (err) {
        console.log(err);
        return res.send({ message: "Internal server error", success: false, data: err });
    }

}
module.exports = { updateChats,saveChats,getChats };
