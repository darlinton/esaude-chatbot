class BotInterface {
  /**
   * Generates a response from the bot based on the given prompt and chat history.
   * This method must be implemented by subclasses.
   * @param {string} prompt - The user's prompt.
   * @param {Array} history - An array of previous messages in the chat.
   * @returns {Promise<string>} The bot's generated response.
   */
  async generateResponse(prompt, history) {
    throw new Error('generateResponse method must be implemented by a subclass.');
  }

  /**
   * Generates a title for the chat session based on the conversation history.
   * This method must be implemented by subclasses.
   * @param {Array} history - An array of previous messages in the chat.
   * @returns {Promise<string>} The suggested title for the chat session.
   */
  async generateTitle(history) {
    throw new Error('generateTitle method must be implemented by a subclass.');
  }
}

module.exports = BotInterface;
