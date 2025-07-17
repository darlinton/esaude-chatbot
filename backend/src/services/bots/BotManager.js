const OpenAIBot = require('./OpenAIBot');
const ReplayBot = require('./ReplayBot');
const GeminiBot = require('./GeminiBot');

/**
 * Returns an instance of the specified bot.
 * @param {string} botId - The ID of the bot to retrieve (e.g., 'openai', 'replay', 'gemini').
 * @returns {BotInterface} An instance of the requested bot.
 * @throws {Error} If the botId is unknown.
 */
function getBot(botId) {
  switch (botId.toLowerCase()) {
    case 'openai':
      return new OpenAIBot(process.env.OPENAI_API_KEY);
    case 'replay':
      return new ReplayBot();
    case 'gemini':
      return new GeminiBot(process.env.GEMINI_API_KEY);
    default:
      throw new Error(`Unknown bot ID: ${botId}`);
  }
}

module.exports = {
  getBot,
};
