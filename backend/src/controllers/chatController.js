const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const { getBot } = require('../services/bots/BotManager');

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
        const chatSession = await ChatSession.findById(req.params.id).populate('messages');

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

// @desc    Send a message and get bot response
// @route   POST /api/chats/:sessionId/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { sessionId, content, botType } = req.body;
  const userId = req.user.id;

  try {
    const chatSession = await ChatSession.findById(sessionId);

    if (!chatSession || chatSession.user.toString() !== userId) {
      return res.status(404).json({ message: 'Chat session not found or unauthorized.' });
    }

    const userMessage = new Message({
      session: chatSession._id,
      sender: 'user',
      user: userId,
      content: content,
    });
    await userMessage.save();
    chatSession.messages.push(userMessage._id);

    const history = await Message.find({ session: chatSession._id }).sort('timestamp');
    
    const bot = getBot(botType);
    const botResponseContent = await bot.generateResponse(content, history);

    const botMessage = new Message({
      session: chatSession._id,
      sender: 'bot',
      content: botResponseContent,
    });
    await botMessage.save();
    chatSession.messages.push(botMessage._id);
    await chatSession.save();

    // Update chat session title only after the first message and bot reply
    if (chatSession.messages.length === 2) {
      await updateChatSessionTitle(chatSession, botType);
    }

    res.status(200).json({ userMessage, botMessage, sessionId: chatSession._id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

const updateChatSessionTitle = async (chatSession, botType) => {
  try {
    // Fetch the full message history for the chat session
    const fullHistory = await Message.find({ session: chatSession._id }).sort('timestamp');

    // Generate title based on conversation
    const botInstance = getBot(botType);
    const suggestedTitle = await botInstance.generateTitle(fullHistory);

    chatSession.title = suggestedTitle;
    await chatSession.save();

    return { success: true };
  } catch (error) {
    console.error('Error updating chat session title:', error);
    return { success: false, message: error.message };
  }
};

module.exports = {
    createChatSession,
    getChatSessions,
    getChatSessionById,
    sendMessage,
    updateChatSessionTitle
};
