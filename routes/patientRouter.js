const express = require('express');
const {appointments, patientReview,fetchPatientReview, getAvailableTimeSlots} = require('../controller/patientController');
const verifyToken = require('../middlewares/verifyToken.js');
const patientRouter  =express.Router();


patientRouter.post('/appointments',verifyToken,appointments);
patientRouter.post('/get-available-time-slots',verifyToken,getAvailableTimeSlots);
patientRouter.post('/review',verifyToken,patientReview)
patientRouter.get('/review',verifyToken,fetchPatientReview)
module.exports = patientRouter;