const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const { generateBotResponse } = require('../utils/chatbotService');

// @desc    Send a new message and get bot response
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { sessionId, content, botType } = req.body;

    if (!sessionId || !content || !botType) {
        return res.status(400).json({ message: 'Session ID, content and botType are required' });
    }

    try {
        const session = await ChatSession.findById(sessionId);
        if (!session || session.user.toString() !== req.user.id) {
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
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all messages for a specific chat session
// @route   GET /api/messages/:sessionId
// @access  Private
const getMessagesBySession = async (req, res) => {
    try {
        const session = await ChatSession.findById(req.params.sessionId);
        if (!session || session.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Chat session not found or unauthorized' });
        }

        const messages = await Message.find({ session: req.params.sessionId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessagesBySession
};
