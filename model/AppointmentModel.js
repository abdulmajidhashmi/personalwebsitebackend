const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({



    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true,
    },
    date:{
        require:true,
        type:String,
    },
    time:{
        require:true,
        type:String,
    }
})

const appointmentModel = mongoose.model('appointments',appointmentSchema);

module.exports = appointmentModel;