const User = require('../models/User');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const Evaluation = require('../models/Evaluation');

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

// @desc    Get all user sessions
// @route   GET /api/admin/sessions
// @access  Admin
exports.getAllUserSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find().populate('user', 'displayName email');
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
