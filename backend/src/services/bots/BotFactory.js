const ReplayBot = require('./ReplayBot');
const OpenAIBot = require('./OpenAIBot');
const GeminiBot = require('./GeminiBot');

class BotFactory {
  /**
   * Creates and returns a bot instance based on the specified bot type.
   * @param {string} botType - The type of bot to create (e.g., 'replay', 'openai', 'gemini').
   * @returns {BotInterface} An instance of the requested bot.
   * @throws {Error} If the bot type is not recognized.
   */
  static createBot(botType) {
    switch (botType.toLowerCase()) {
      case 'replay':
        return new ReplayBot();
      case 'openai':
        return new OpenAIBot(process.env.OPENAI_API_KEY);
      case 'gemini':
        return new GeminiBot(process.env.GEMINI_API_KEY);
      default:
        throw new Error(`Unknown bot type: ${botType}`);
    }
  }
}

module.exports = BotFactory;
