const User = require('../models/User');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const Evaluation = require('../models/Evaluation');
const BotPrompt = require('../models/BotPrompt');
const BotApiKey = require('../models/BotApiKey');
const { parse } = require('json2csv');

// @desc    Upgrade a user to admin role
// @route   POST /api/admin/upgrade-user
// @access  Admin (via terminal command/internal tool for now)
exports.upgradeUserToAdmin = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).json({ message: `User ${email} upgraded to admin successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get session details for a specific session
// @route   GET /api/admin/sessions/:sessionId
// @access  Admin
exports.getSessionDetails = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await ChatSession.findById(sessionId).populate('user', 'displayName email').select('-_id -__v');
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const messages = await Message.find({ session: sessionId }).sort('timestamp');
        const evaluations = await Evaluation.find({ session: sessionId });

        const sessionDetails = {
            ...session.toObject(),
            messages,
            evaluations,
        };

        res.status(200).json(sessionDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all user sessions
// @route   GET /api/admin/sessions
// @access  Admin
exports.getAllUserSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find().populate('user', 'displayName email').sort({ createdAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get chat messages for a specific session
// @route   GET /api/admin/sessions/:sessionId/messages
// @access  Admin
exports.getSessionMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatSession: req.params.sessionId }).sort('timestamp');
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get evaluations for a specific session
// @route   GET /api/admin/sessions/:sessionId/evaluations
// @access  Admin
exports.getSessionEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ chatSession: req.params.sessionId });
        res.status(200).json(evaluations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new bot prompt
// @route   POST /api/admin/prompts
// @access  Admin
exports.createBotPrompt = async (req, res) => {
    const { promptName, botType, promptContent, isDefault } = req.body;

    try {
        if (isDefault) {
            await BotPrompt.updateMany({ botType }, { isDefault: false });
        }
        const newPrompt = new BotPrompt({ promptName, botType, promptContent, isDefault });
        await newPrompt.save();
        res.status(201).json(newPrompt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all bot prompts
// @route   GET /api/admin/prompts
// @access  Admin
exports.getAllBotPrompts = async (req, res) => {
    try {
        const prompts = await BotPrompt.find();
        res.status(200).json(prompts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single bot prompt by ID
// @route   GET /api/admin/prompts/:id
// @access  Admin
exports.getBotPromptById = async (req, res) => {
    try {
        const prompt = await BotPrompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }
        res.status(200).json(prompt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a bot prompt
// @route   PUT /api/admin/prompts/:id
// @access  Admin
exports.updateBotPrompt = async (req, res) => {
    const { promptName, botType, promptContent, isDefault } = req.body;

    try {
        const prompt = await BotPrompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }

        if (isDefault && !prompt.isDefault) { // If setting to default and it wasn't already
            await BotPrompt.updateMany({ botType: prompt.botType }, { isDefault: false });
        } else if (!isDefault && prompt.isDefault) { // If removing default status
            // Ensure there's always a default, or handle this case as per business logic
            // For now, we'll allow removing default, but a frontend check should prevent leaving no default
        }

        prompt.promptName = promptName || prompt.promptName;
        prompt.botType = botType || prompt.botType;
        prompt.promptContent = promptContent || prompt.promptContent;
        prompt.isDefault = isDefault !== undefined ? isDefault : prompt.isDefault;

        await prompt.save();
        res.status(200).json(prompt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a bot prompt
// @route   DELETE /api/admin/prompts/:id
// @access  Admin
exports.deleteBotPrompt = async (req, res) => {
    try {
        const prompt = await BotPrompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }

        // Prevent deleting the last default prompt for a botType
        if (prompt.isDefault) {
            const defaultCount = await BotPrompt.countDocuments({ botType: prompt.botType, isDefault: true });
            if (defaultCount === 1) {
                return res.status(400).json({ message: 'Cannot delete the last default prompt for this bot type.' });
            }
        }

        await prompt.deleteOne();
        res.status(200).json({ message: 'Prompt removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Set a bot prompt as default
// @route   PUT /api/admin/prompts/:id/set-default
// @access  Admin
exports.setDefaultBotPrompt = async (req, res) => {
    try {
        const prompt = await BotPrompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }

        // Unset current default for this botType
        await BotPrompt.updateMany({ botType: prompt.botType }, { isDefault: false });

        // Set the selected prompt as default
        prompt.isDefault = true;
        await prompt.save();

        res.status(200).json(prompt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all bot API keys
// @route   GET /api/admin/api-keys
// @access  Admin
exports.getAllBotApiKeys = async (req, res) => {
    try {
        const apiKeys = await BotApiKey.find();
        // In a real application, you might mask the API key content for security
        res.status(200).json(apiKeys.map(key => ({
            _id: key._id,
            botType: key.botType,
            apiKey: key.apiKey ? '********' : null, // Mask actual key
            createdAt: key.createdAt,
            updatedAt: key.updatedAt
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a bot API key
// @route   PUT /api/admin/api-keys/:botType
// @access  Admin
exports.updateBotApiKey = async (req, res) => {
    const { apiKey } = req.body;
    const { botType } = req.params;

    try {
        let botApiKey = await BotApiKey.findOne({ botType });

        if (!botApiKey) {
            // If not found, create a new one
            botApiKey = new BotApiKey({ botType, apiKey });
        } else {
            botApiKey.apiKey = apiKey;
        }

        await botApiKey.save();
        res.status(200).json({ message: `${botType} API key updated successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Export chat sessions to CSV
// @route   GET /api/admin/sessions/export
// @access  Admin
exports.exportChatSessions = async (req, res) => {
    console.log('exportChatSessions called');
    try {
        const messages = await Message.find()
            .populate({
                path: 'session',
                populate: { path: 'user', select: 'displayName email' }
            })
            .sort('timestamp');

        console.log(`Found ${messages.length} messages`);

        if (!messages || messages.length === 0) {
            console.log('No messages found, returning 404');
            return res.status(404).json({ message: 'No chat sessions found to export.' });
        }

        const csvData = messages.map(message => ({
            SessionID: message.session?._id.toString() || 'N/A',
            UserID: message.session?.user?.email.toString() || 'N/A',
            User: message.session.user?.displayName.toString() || 'N/A',
            SessionTitle: message.session?.title?.toString() || 'N/A',
            Bot: message.session?.botType?.toString() || 'N/A',
            MessageID: message._id.toString(),
            MessageContent: message.content,
            Sender: message.sender,
            Timestamp: message.timestamp.toISOString(),
        }));

        //console.log('CSV data generated, attempting to parse', csvData.length);
        try {
            const csv = parse(csvData, {
                fields: ['SessionID', 'UserID', 'User', 'SessionTitle', 'Bot', 'MessageID', 'MessageContent', 'Sender', 'Timestamp'],
            });
            //console.log('CSV parsing successful');
            //console.log(csv);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="chat_sessions.csv"');
            res.status(200).send(csv);
        } catch (parseError) {
            console.error('Error during CSV parsing:', parseError);
            return res.status(500).json({ message: 'Server error exporting chat sessions - CSV parsing failed' });
        }

    } catch (error) {
        console.error('Error exporting chat sessions:', error);
        res.status(500).json({ message: 'Server error exporting chat sessions' });
    }
    
};
// @desc    Export chat sessions to JSON
// @route   GET /api/admin/sessions/export/json
// @access  Admin
exports.exportChatSessionsJson = async (req, res) => {
    try {
        const sessions = await ChatSession.find()
            .populate('user', 'displayName email')
            .populate({
                path: 'messages',
                options: { sort: 'timestamp' }
            })
            .sort({ createdAt: -1 });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: 'No chat sessions found to export.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=chat_sessions.json');
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error exporting chat sessions to JSON:', error);
        res.status(500).json({ message: 'Server error exporting chat sessions to JSON' });
    }
};
