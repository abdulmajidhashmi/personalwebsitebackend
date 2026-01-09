const express = require('express');
const {appointments, patientReview,fetchPatientReview, getAvailableTimeSlots} = require('../controller/patientController');
const verifyUser = require('../middlewares/authorization/verifyUser');
const patientRouter  =express.Router();


patientRouter.post('/appointments',verifyUser,appointments);
patientRouter.post('/get-available-time-slots',verifyUser,getAvailableTimeSlots);
patientRouter.post('/review',verifyUser,patientReview)
patientRouter.get('/review',verifyUser,fetchPatientReview)
module.exports = patientRouter;