const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const { generateBotResponse } = require('../utils/chatbotService');
const logger = require('../config/logger'); // Import logger

// @desc    Send a new message and get bot response
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => { // Added next parameter
    const { sessionId, content, botType } = req.body;

    if (!sessionId || !content || !botType) {
        return res.status(400).json({ message: 'Session ID, content and botType are required' });
    }

    try {
        const session = await ChatSession.findById(sessionId);
        if (!session || session.user.toString() !== req.user.id) {
            logger.warn(`[sendMessage] Chat session ${sessionId} not found or unauthorized for user ${req.user.id}.`); // Use logger
            return res.status(404).json({ message: 'Chat session not found or unauthorized' });
        }

        // Save user message
        const userMessage = await Message.create({
            session: sessionId,
            sender: 'user',
            user: req.user.id,
            content: content
        });

        // Fetch chat history
        const history = await Message.find({ session: sessionId }).sort({ timestamp: 1 });

        // Get bot response
        const botResponseContent = await generateBotResponse(content, history, botType);

        // Save bot message
        const botMessage = await Message.create({
            session: sessionId,
            sender: 'bot',
            content: botResponseContent,
            botType: botType
        });

        res.status(201).json({ userMessage, botMessage });
    } catch (error) {
        logger.error('Error sending message:', error); // Use logger
        next(error); // Pass error to the centralized error handler
    }
};

// @desc    Get all messages for a specific chat session
// @route   GET /api/messages/:sessionId
// @access  Private
const getMessagesBySession = async (req, res, next) => { // Added next parameter
    try {
        const session = await ChatSession.findById(req.params.sessionId);
        if (!session || session.user.toString() !== req.user.id) {
            logger.warn(`[getMessagesBySession] Chat session ${req.params.sessionId} not found or unauthorized for user ${req.user.id}.`); // Use logger
            return res.status(404).json({ message: 'Chat session not found or unauthorized' });
        }

        const messages = await Message.find({ session: req.params.sessionId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        logger.error('Error fetching messages by session:', error); // Use logger
        next(error); // Pass error to the centralized error handler
    }
};

module.exports = {
    sendMessage,
    getMessagesBySession
};
