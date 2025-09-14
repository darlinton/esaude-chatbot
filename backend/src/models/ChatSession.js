const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'New Chat'
    },
    botType: {
        type: String,
        enum: ['openai', 'gemini', 'replay'], // Add botType field
        required: true,
        default: 'openai' // Default bot type
    },
    promptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BotPrompt',
        default: null // Will be set dynamically or default
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    evaluation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluation',
        default: null // No evaluation by default
    }
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
