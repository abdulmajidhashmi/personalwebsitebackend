const express = require('express');
const {  updateChats, getChats } = require('../controller/chatController');
const chatRouter =express.Router();

chatRouter.post('/',updateChats);
chatRouter.post('/userChat',getChats);

module.exports =chatRouter;