const BotFactory = require('../services/bots/BotFactory');

async function generateBotResponse(prompt, history, botType = 'chatgpt') {
  try {
    const bot = BotFactory.createBot(botType);
    const response = await bot.generateResponse(prompt, history);
    return response;
  } catch (error) {
    console.error('Error generating bot response:', error);
    throw error;
  }
}

module.exports = {
  generateBotResponse,
};
