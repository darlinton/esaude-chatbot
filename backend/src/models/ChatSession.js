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
    createdAt: {
        type: Date,
        default: Date.now
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
