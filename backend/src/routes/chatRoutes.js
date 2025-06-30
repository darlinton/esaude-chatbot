const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createChatSession,
    getChatSessions,
    getChatSessionById
} = require('../controllers/chatController');

router.route('/').post(protect, createChatSession).get(protect, getChatSessions);
router.route('/:id').get(protect, getChatSessionById);

module.exports = router;
