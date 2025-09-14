const BotInterface = require('./BotInterface');
const { OpenAI } = require('openai');
const logger = require('../../config/logger'); // Import the logger

class OpenAIBot extends BotInterface {
  constructor(apiKey, systemPromptContent) {
    super();
    if (!apiKey) {
      throw new Error('OpenAI API key is not provided.');
    }
    this.openai = new OpenAI({ apiKey });
    this.systemPromptContent = systemPromptContent;
  }

  /**
   * Generates a response using the OpenAI model.
   * @param {string} prompt - The user's prompt.
   * @param {Array} history - An array of previous messages in the chat.
   * @returns {Promise<string>} The generated response from OpenAI.
   */
  async generateResponse(prompt, history) {
    try {
      const messages = [];
      if (this.systemPromptContent) {
        messages.push({ role: 'system', content: this.systemPromptContent });
      }

      // Adiciona o histórico da conversa
      history.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant', // Correctly using msg.sender
          content: msg.content
        });
      });
  
      // Adiciona a mensagem atual do usuário
      messages.push({ role: 'user', content: prompt });
  
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
      });
  
      return completion.choices[0].message.content;
    } catch (error) {
      logger.error('Error generating OpenAI response:', error);
      throw error;
    }
  }

  /**
   * Generates a title for the chat session using the OpenAI model.
   * @param {Array} history - An array of previous messages in the chat.
   * @returns {Promise<string>} The suggested title for the chat session.
   */
  async generateTitle(history) {
    try {
      const messages = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Ensure there's at least one message with content before proceeding
      if (!messages || messages.length === 0 || !messages[0].content) {
        return 'Chat Session'; // Fallback if no valid messages
      }

      messages.push({
        role: 'user',
        content: 'Por favor, resuma a conversa acima em um título curto e conciso (com menos de 10 palavras). Não inclua frases conversacionais ou saudações. Apenas o título.'
      });

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 20, // Limit title length
      });

      let title = completion.choices[0].message.content.trim();

      // Remove any leading/trailing quotes if the model returns them
      if (title.startsWith('"') && title.endsWith('"')) {
        title = title.slice(1, -1);
      }
      if (title.startsWith("'") && title.endsWith("'")) {
        title = title.slice(1, -1);
      }

      return title;
    } catch (error) {
      logger.error('Error generating OpenAI title:', error);
      // Fallback to a generic title if title generation fails
      return 'Chat Session';
    }
  }
}

module.exports = OpenAIBot;
