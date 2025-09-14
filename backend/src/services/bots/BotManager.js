const OpenAIBot = require('./OpenAIBot');
const ReplayBot = require('./ReplayBot');
const GeminiBot = require('./GeminiBot');
const BotApiKey = require('../../models/BotApiKey'); // Import BotApiKey model
const BotPrompt = require('../../models/BotPrompt'); // Import BotPrompt model

/**
 * Returns an instance of the specified bot.
 * @param {string} botId - The ID of the bot to retrieve (e.g., 'openai', 'replay', 'gemini').
 * @param {ObjectId} promptId - The ID of the prompt to use. If null, the default prompt for the botType will be used.
 * @returns {BotInterface} An instance of the requested bot.
 * @throws {Error} If the botId is unknown, API key is missing, or prompt is not found.
 */
async function getBot(botId, promptId) {
  let apiKey;
  let systemPromptContent = null;

  // Fetch API Key
  if (botId !== 'replay') { // ReplayBot doesn't need an API key
    const botApiKey = await BotApiKey.findOne({ botType: botId.toLowerCase() });
    if (!botApiKey || !botApiKey.apiKey) {
      throw new Error(`API key not found for bot type: ${botId}`);
    }
    apiKey = botApiKey.apiKey;
  }

  // Fetch System Prompt Content
  if (botId !== 'replay') { // ReplayBot doesn't use dynamic prompts
    let botPrompt;
    if (promptId) {
      botPrompt = await BotPrompt.findById(promptId);
      if (!botPrompt) {
        console.warn(`Prompt with ID ${promptId} not found. Falling back to default prompt for ${botId}.`);
        botPrompt = await BotPrompt.findOne({ botType: botId.toLowerCase(), isDefault: true });
      }
    } else {
      botPrompt = await BotPrompt.findOne({ botType: botId.toLowerCase(), isDefault: true });
    }

    if (botPrompt) {
      systemPromptContent = botPrompt.promptContent;
    } else {
      console.warn(`No default prompt found for bot type: ${botId}. Bot will operate without a system prompt.`);
    }
  }

  switch (botId.toLowerCase()) {
    case 'openai':
      return new OpenAIBot(apiKey, systemPromptContent);
    case 'replay':
      return new ReplayBot();
    case 'gemini':
      return new GeminiBot(apiKey, systemPromptContent);
    default:
      throw new Error(`Unknown bot ID: ${botId}`);
  }
}

module.exports = {
  getBot,
};
