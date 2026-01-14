const express = require('express');
const {  updateChats } = require('../controller/chatController');
const chatRouter =express.Router();

chatRouter.post('/',updateChats);

module.exports =chatRouter;