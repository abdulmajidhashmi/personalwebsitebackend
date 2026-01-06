const appointmentModel = require("../model/AppointmentModel");
const patientReviewModel = require("../model/patientReviewModel");
const userUpdatedModel = require('../model/userUpdatedModel');

const appointments = async (req, res) => {
    const { date, time, type, description } = req.body;
    const { phone } = req.cook;
    try {
        const userData = await userUpdatedModel.findOne({ phone })
        if (!userData) {
            return res.send({ message: "Internal server error", success: false, data: "not abled to fetch the user" });
        }
        const userfullData = new appointmentModel({
            user: userData._id,
            date: date,
            time: time,
            type: type,
            description: description
        })
        await userfullData.save();
        res.send({ message: "appointment scheduled", success: true, data: "appointment created" });
    } catch (err) {
        return res.send({ message: "Internal server error", success: false, data: err });
    }


}


const patientReview = async (req, res) => {

    const { rating, review } = req.body;
    const { phone } = req.cook;
    try {
        const userData = await userUpdatedModel.findOne({ phone })
        if (!userData) {
            return res.send({ message: "Internal server error", success: false, data: "not abled to fetch the user" });
        }
        const patientReviewData = new patientReviewModel({
            user: userData._id,
            rating: rating,
            review: review,
        })
        await patientReviewData.save();
        res.send({ message: "review submitted", success: true, data: null });
    } catch (err) {
        return res.send({ message: "Internal server error", success: false, data: err });
    }


}

const fetchPatientReview = async (req, res) => {
    try {

        const reviewData = await patientReviewModel.find().populate('user','name picture');
        console.log(reviewData);
        return res.send({ message: "data fetched", success: true, data: reviewData });

    } catch (err) {
        return res.send({ message: "Internal server error", success: false, data: err });
    }


}


const getAvailableTimeSlots = async (req, res) => {

    const body=req.body;
    console.log(body.date);
    try {

        const AvailableDates = await appointmentModel.find({date:body.date});


        return res.send({ message: "data fetched", success: true, data: AvailableDates});

    } catch (err) {
        return res.send({ message: "Internal server error", success: false, data: err });
    }


}


module.exports = { appointments, patientReview, fetchPatientReview ,getAvailableTimeSlots};