const mongoose = require('mongoose');


const userUpdatedSchema = mongoose.Schema({


    name: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        unique: true,
        sparse: true,
        default: null
    },
    email: {

        type: String,
        unique: true,
        sparse: true,
        default: null
    },
    loginMethod: {
        required: true,
        type: String,
        default: 'google'
    },
    role: {
        required: true,
        type: String,
        default: "user"
    },
    picture: {
        type: String,
        default: null
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const userUpdatedModel = mongoose.model("newUser", userUpdatedSchema);


module.exports = userUpdatedModel;