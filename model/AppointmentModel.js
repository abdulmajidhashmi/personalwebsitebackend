const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({



    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    date:{
        required:true,
        type:String,
    },
    time:{
        required:true,
        type:String,
    },
    type:{
        required:true,
        type:String,
    },
    description:{
        required:true,
        type:String
    }
    
},{
    timestamps:true,
})



const appointmentModel = mongoose.model('appointments',appointmentSchema);

module.exports = appointmentModel;