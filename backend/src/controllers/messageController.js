const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const { getBotResponse } = require('../utils/chatbotService');

// @desc    Send a new message and get bot response
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { sessionId, content } = req.body;

    if (!sessionId || !content) {
        return res.status(400).json({ message: 'Session ID and content are required' });
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
            content: content
        });

        // Get bot response (placeholder or actual AI call)
        const botResponseContent = await getBotResponse(content);

        // Save bot message
        const botMessage = await Message.create({
            session: sessionId,
            sender: 'bot',
            content: botResponseContent
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
