const express = require('express');
const {appointments, patientReview,fetchPatientReview} = require('../controller/patientController');
const verifyToken = require('../middlewares/verifyToken.js');
const patientRouter  =express.Router();


patientRouter.post('/appointments',verifyToken,appointments);
patientRouter.post('/review',verifyToken,patientReview)
patientRouter.get('/review',verifyToken,fetchPatientReview)
module.exports = patientRouter;