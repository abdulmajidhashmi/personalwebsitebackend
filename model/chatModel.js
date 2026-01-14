const mongoose = require('mongoose');


const messageSchema = mongoose.Schema({

    userType:{
        type:String,
        enum:["admin","user"],
        required:true
    },
    text:{
        type:String,
        require:true
    },
    sentAt:{
        type:Date,
        default:Date.now
    }
})

const chatSchema = mongoose.Schema({

    userPhone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'newUser',
        required: true,
        unique: true
    },
    messages:[messageSchema]

});


const chatModel = mongoose.model('chat',chatSchema);

module.exports =chatModel;