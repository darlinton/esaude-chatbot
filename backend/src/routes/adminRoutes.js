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
    getSessionDetails,
    exportChatSessions,
    exportChatSessionsJson
} = require('../controllers/adminController');
const { body, validationResult } = require('express-validator'); // Import validation functions

const router = express.Router();

// Admin-specific routes
router.route('/upgrade-user')
    .post(
        protect,
        authorize('admin'),
        [
            body('email').isEmail().withMessage('Must be a valid email address'),
        ],
        upgradeUserToAdmin
    );
router.route('/sessions').get(protect, authorize('admin'), getAllUserSessions);
router.route('/sessions/export').get(protect, authorize('admin'), exportChatSessions);
router.route('/sessions/export/json').get(protect, authorize('admin'), exportChatSessionsJson);
router.route('/sessions/:sessionId/messages').get(protect, authorize('admin'), getSessionMessages);
router.route('/sessions/:sessionId/evaluations').get(protect, authorize('admin'), getSessionEvaluations);
router.route('/sessions/:sessionId').get(protect, authorize('admin'), getSessionDetails);

// Bot Prompt Management Routes
router.route('/prompts')
    .post(
        protect,
        authorize('admin'),
        [
            body('promptName').notEmpty().withMessage('Prompt name is required'),
            body('botType').notEmpty().withMessage('Bot type is required'),
            body('promptContent').notEmpty().withMessage('Prompt content is required'),
            body('isDefault').isBoolean().withMessage('isDefault must be a boolean'),
        ],
        createBotPrompt
    )
    .get(protect, authorize('admin'), getAllBotPrompts);
router.route('/prompts/:id')
    .get(protect, authorize('admin'), getBotPromptById)
    .put(
        protect,
        authorize('admin'),
        [
            body('promptName').optional().notEmpty().withMessage('Prompt name cannot be empty if provided'),
            body('botType').optional().notEmpty().withMessage('Bot type cannot be empty if provided'),
            body('promptContent').optional().notEmpty().withMessage('Prompt content cannot be empty if provided'),
            body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean'),
        ],
        updateBotPrompt
    )
    .delete(protect, authorize('admin'), deleteBotPrompt);
router.route('/prompts/:id/set-default').put(protect, authorize('admin'), setDefaultBotPrompt);

// Bot API Key Management Routes
router.route('/api-keys')
    .get(protect, authorize('admin'), getAllBotApiKeys);
router.route('/api-keys/:botType')
    .put(
        protect,
        authorize('admin'),
        [
            body('apiKey').notEmpty().withMessage('API key is required'),
        ],
        updateBotApiKey
    );


router.route('/sessions/export').get(protect, authorize('admin'), exportChatSessions);

module.exports = router;
