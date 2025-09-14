const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const BotPrompt = require('../models/BotPrompt'); // Import BotPrompt model
const { getBot } = require('../services/bots/BotManager');
const logger = require('../config/logger'); // Import logger

// @desc    Create a new chat session
// @route   POST /api/chats
// @access  Private
const createChatSession = async (req, res, next) => { // Added next parameter
    // Safely get properties from req.body, defaulting to an empty object if req.body is null or undefined
    const { title, botType, promptId } = req.body || {};

    try {
      const newTitle = title || 'New Chat';  
      let selectedPromptId = promptId;
      const sessionBotType = botType || 'openai'; // Default to 'openai' if not provided

        // If no promptId is provided, find the default prompt for the sessionBotType
        if (!selectedPromptId && sessionBotType) {
            const defaultPrompt = await BotPrompt.findOne({ botType: sessionBotType, isDefault: true });
            if (defaultPrompt) {
                selectedPromptId = defaultPrompt._id;
            }
        }

        const chatSession = await ChatSession.create({
            user: req.user.id,
            title: newTitle,
            botType: sessionBotType, // Store the selected bot type
            promptId: selectedPromptId // Assign the selected prompt ID
        });
        res.status(201).json(chatSession);
    } catch (error) {
        logger.error('Error creating chat session:', error); // Use logger
        next(error); // Pass error to the centralized error handler
    }
};

// @desc    Get all chat sessions for the logged-in user
// @route   GET /api/chats
// @access  Private
const getChatSessions = async (req, res, next) => { // Added next parameter
    try {
        const chatSessions = await ChatSession.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(chatSessions);
    } catch (error) {
        logger.error('Error fetching chat sessions:', error); // Use logger
        next(error); // Pass error to the centralized error handler
    }
};

// @desc    Get a single chat session by ID
// @route   GET /api/chats/:id
// @access  Private
const getChatSessionById = async (req, res, next) => { // Added next parameter
    try {
        const chatSession = await ChatSession.findById(req.params.id).populate('messages');

        if (!chatSession) {
            logger.warn(`[getChatSessionById] Chat session ${req.params.id} not found.`); // Use logger
            return res.status(404).json({ message: 'Chat session not found' });
        }

        logger.debug(`[getChatSessionById] User ID from token: ${req.user.id}`); // Use logger
        logger.debug(`[getChatSessionById] Chat session owner ID: ${chatSession.user.toString()}`); // Use logger
        logger.debug(`[getChatSessionById] User role: ${req.user.role}`); // Use logger

        // Ensure the session belongs to the logged-in user
        if (chatSession.user.toString() !== req.user.id) {
            logger.warn(`[getChatSessionById] Authorization failed: Session owner (${chatSession.user.toString()}) does not match logged-in user (${req.user.id}).`); // Use logger
            return res.status(403).json({ message: 'Not authorized to view this chat session' });
        }

        logger.debug(`[getChatSessionById] Authorization successful for session ${req.params.id}.`); // Use logger

        res.status(200).json(chatSession);
    } catch (error) {
        logger.error('Error fetching chat session by ID:', error); // Use logger
        next(error); // Pass error to the centralized error handler
    }
};

// @desc    Send a message and get bot response
// @route   POST /api/chats/:sessionId/messages
// @access  Private
const sendMessage = async (req, res, next) => { // Added next parameter
  const { sessionId, content, botType } = req.body;
  const userId = req.user.id;

  try {
    const chatSession = await ChatSession.findById(sessionId);

    if (!chatSession || chatSession.user.toString() !== userId) {
      logger.warn(`[sendMessage] Chat session ${sessionId} not found or unauthorized for user ${userId}.`); // Use logger
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

    // Update botType if it has changed
    if (botType && chatSession.botType !== botType) {
      chatSession.botType = botType;
    }

    const history = await Message.find({ session: chatSession._id }).sort('timestamp');
    
    const bot = await getBot(botType, chatSession.promptId);
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
      // Fetch the session again to get the updated title
      const updatedSession = await ChatSession.findById(sessionId);
      res.status(200).json({ userMessage, botMessage, sessionId: chatSession._id, sessionTitle: updatedSession.title });
      return; // Exit after sending the response with the new title
    }

    res.status(200).json({ userMessage, botMessage, sessionId: chatSession._id });
  } catch (error) {
    logger.error('Error sending message:', error); // Use logger
    next(error); // Pass error to the centralized error handler
  }
};

const updateChatSessionTitle = async (chatSession, botType, next) => { // Added next parameter
  logger.info(`[updateChatSessionTitle] Attempting to update title for session: ${chatSession._id}`); // Use logger
  try {
    const fullHistory = await Message.find({ session: chatSession._id }).sort('timestamp');
    logger.debug(`[updateChatSessionTitle] Fetched history for session ${chatSession._id}, messages count: ${fullHistory.length}`); // Use logger

    const sessionWithPrompt = await ChatSession.findById(chatSession._id).populate('promptId');
    if (!sessionWithPrompt) {
      logger.error(`[updateChatSessionTitle] Error: Chat session ${chatSession._id} not found during title update.`); // Use logger
      return { success: false, message: 'Chat session not found.' };
    }

    const botInstance = await getBot(botType, sessionWithPrompt.promptId ? sessionWithPrompt.promptId._id : null);
    logger.debug(`[updateChatSessionTitle] Bot instance created for botType: ${botType}`); // Use logger

    const suggestedTitle = await botInstance.generateTitle(fullHistory);

    sessionWithPrompt.title = suggestedTitle;
    await sessionWithPrompt.save();

    return { success: true };
  } catch (error) {
    logger.error(`[updateChatSessionTitle] Error updating chat session title for ${chatSession._id}:`, error); // Use logger
    next(error); // Pass error to the centralized error handler
  }
};

module.exports = {
    createChatSession,
    getChatSessions,
    getChatSessionById,
    sendMessage,
    updateChatSessionTitle
};
