const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');

// @desc    Create a new chat session
// @route   POST /api/chats
// @access  Private
const createChatSession = async (req, res) => {
    try {
        const chatSession = await ChatSession.create({
            user: req.user.id,
            title: req.body.title || 'New Chat'
        });
        res.status(201).json(chatSession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all chat sessions for the logged-in user
// @route   GET /api/chats
// @access  Private
const getChatSessions = async (req, res) => {
    try {
        const chatSessions = await ChatSession.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(chatSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single chat session by ID
// @route   GET /api/chats/:id
// @access  Private
const getChatSessionById = async (req, res) => {
    try {
        const chatSession = await ChatSession.findById(req.params.id);

        if (!chatSession) {
            return res.status(404).json({ message: 'Chat session not found' });
        }

        // Ensure the session belongs to the logged-in user
        if (chatSession.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this chat session' });
        }

        res.status(200).json(chatSession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createChatSession,
    getChatSessions,
    getChatSessionById
};
