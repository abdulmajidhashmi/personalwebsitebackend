const mongoose = require('mongoose');


const userUpdatedSchema = mongoose.Schema({


    name: {
    
        type: String
    },
    number: {
        required: true,
        type: String,
        unique: true
    },
    email: {
   
        type: String,
        unique: true
    },
    loginMethod: {
        required: true,
        type: String
    },
    role: {
        required: true,
        type: String,
        default: "user"
    }
}, { timestamps: true })

const userUpdatedModel = mongoose.model("newUser", userUpdatedSchema);


module.exports = userUpdatedModel;