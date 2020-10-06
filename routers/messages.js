const express = require('express');
const router = new express.Router();
const messageController = require('../controllers/messages');
const auth = require('../middleware/auth');

router.post('/messages/:slug', auth, messageController.createMessage);

router.get('/my/messages', auth, messageController.readMessages);

router.get('/messages/:slug', auth, messageController.readMessage);

router.patch('/messages', auth, messageController.unnotifyMessages);

module.exports = router;
