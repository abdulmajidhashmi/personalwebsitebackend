const express = require('express');
const appointments = require('../controller/patientController');
const patientRouter  =express.Router();


patientRouter.post('/appointments',appointments);
module.exports = patientRouter;