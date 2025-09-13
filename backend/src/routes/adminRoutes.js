const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    upgradeUserToAdmin,
    getAllUserSessions,
    getSessionMessages,
    getSessionEvaluations
} = require('../controllers/adminController');

const router = express.Router();

// Admin-specific routes
router.route('/upgrade-user').post(protect, authorize('admin'), upgradeUserToAdmin);
router.route('/sessions').get(protect, authorize('admin'), getAllUserSessions);
router.route('/sessions/:sessionId/messages').get(protect, authorize('admin'), getSessionMessages);
router.route('/sessions/:sessionId/evaluations').get(protect, authorize('admin'), getSessionEvaluations);

module.exports = router;
