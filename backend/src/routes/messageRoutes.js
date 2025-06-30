const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessagesBySession } = require('../controllers/messageController');

router.route('/').post(protect, sendMessage);
router.route('/:sessionId').get(protect, getMessagesBySession);

module.exports = router;
