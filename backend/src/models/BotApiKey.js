const mongoose = require('mongoose');

const BotApiKeySchema = new mongoose.Schema({
  botType: { type: String, required: true, unique: true, enum: ['openai', 'gemini'] },
  apiKey: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('BotApiKey', BotApiKeySchema);
