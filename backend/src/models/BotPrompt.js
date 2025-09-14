const mongoose = require('mongoose');

const BotPromptSchema = new mongoose.Schema({
  promptName: { type: String, required: true },
  botType: { type: String, required: true, enum: ['openai', 'gemini'] }, // Extend as needed
  promptContent: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

BotPromptSchema.index({ botType: 1, promptName: 1 }, { unique: true }); // Ensure unique prompt names per bot type
BotPromptSchema.index({ botType: 1, isDefault: 1 }, { unique: true, partialFilterExpression: { isDefault: true } }); // Only one default per botType

module.exports = mongoose.model('BotPrompt', BotPromptSchema);
