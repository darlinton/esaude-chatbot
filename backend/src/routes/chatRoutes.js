const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createChatSession,
    getChatSessions,
    getChatSessionById,
    sendMessage
} = require('../controllers/chatController');

router.route('/')
    .post(protect, createChatSession)
    .get(protect, getChatSessions);

router.route('/:id')
    .get(protect, getChatSessionById);

router.route('/:sessionId/messages')
    .post(protect, sendMessage);

module.exports = router;
