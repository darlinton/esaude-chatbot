const Evaluation = require('../models/Evaluation');
const ChatSession = require('../models/ChatSession');

// @desc    Submit a new evaluation for a chat session
// @route   POST /api/evaluations
// @access  Private
const submitEvaluation = async (req, res) => {
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || !rating) {
        return res.status(400).json({ message: 'Session ID and rating are required' });
    }

    try {
        const session = await ChatSession.findById(sessionId);
        if (!session || session.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Chat session not found or unauthorized' });
        }

        // Check if an evaluation already exists for this session
        const existingEvaluation = await Evaluation.findOne({ session: sessionId });
        if (existingEvaluation) {
            return res.status(400).json({ message: 'Evaluation already submitted for this session' });
        }

        const evaluation = await Evaluation.create({
            session: sessionId,
            user: req.user.id,
            rating,
            comment
        });

        // Associate the evaluation with the chat session
        session.evaluation = evaluation._id;
        await session.save();

        res.status(201).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get evaluation by session ID
// @route   GET /api/evaluations/:sessionId
// @access  Private
const getEvaluationBySession = async (req, res) => {
    try {
        const session = await ChatSession.findById(req.params.sessionId);
        if (!session || session.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Chat session not found or unauthorized' });
        }

        const evaluation = await Evaluation.findOne({ session: req.params.sessionId });

        if (!evaluation) {
            return res.status(404).json({ message: 'No evaluation found for this session' });
        }

        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitEvaluation,
    getEvaluationBySession
};
