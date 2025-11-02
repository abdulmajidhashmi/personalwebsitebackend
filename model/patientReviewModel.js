const mongoose = require('mongoose');

const patientReviewSchema = mongoose.Schema({

    user:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'newUser'
    },review:{
        required:true,
        type:String
    },rating:{
        required:true,
        type:Number
    }

},{timestamps:true});

const patientReviewModel =mongoose.model('patientReview',patientReviewSchema);

module.exports =patientReviewModel;