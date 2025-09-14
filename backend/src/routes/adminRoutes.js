const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    upgradeUserToAdmin,
    getAllUserSessions,
    getSessionMessages,
    getSessionEvaluations,
    createBotPrompt,
    getAllBotPrompts,
    getBotPromptById,
    updateBotPrompt,
    deleteBotPrompt,
    setDefaultBotPrompt,
    getAllBotApiKeys,
    updateBotApiKey,
    getSessionDetails
} = require('../controllers/adminController');

const router = express.Router();

// Admin-specific routes
router.route('/upgrade-user').post(protect, authorize('admin'), upgradeUserToAdmin);
router.route('/sessions').get(protect, authorize('admin'), getAllUserSessions);
router.route('/sessions/:sessionId/messages').get(protect, authorize('admin'), getSessionMessages);
router.route('/sessions/:sessionId/evaluations').get(protect, authorize('admin'), getSessionEvaluations);
router.route('/sessions/:sessionId').get(protect, authorize('admin'), getSessionDetails);

// Bot Prompt Management Routes
router.route('/prompts')
    .post(protect, authorize('admin'), createBotPrompt)
    .get(protect, authorize('admin'), getAllBotPrompts);
router.route('/prompts/:id')
    .get(protect, authorize('admin'), getBotPromptById)
    .put(protect, authorize('admin'), updateBotPrompt)
    .delete(protect, authorize('admin'), deleteBotPrompt);
router.route('/prompts/:id/set-default').put(protect, authorize('admin'), setDefaultBotPrompt);

// Bot API Key Management Routes
router.route('/api-keys')
    .get(protect, authorize('admin'), getAllBotApiKeys);
router.route('/api-keys/:botType')
    .put(protect, authorize('admin'), updateBotApiKey);

module.exports = router;
