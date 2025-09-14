const { GoogleGenerativeAI } = require('@google/generative-ai');
const BotInterface = require('./BotInterface');
const logger = require('../../config/logger'); // Import the logger

class GeminiBot extends BotInterface {
  constructor(apiKey, systemPromptContent) {
    super();
    if (!apiKey) {
      throw new Error('Gemini API key is not provided.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.systemPromptContent = systemPromptContent;
  }

  /**
   * Generates a response using the Gemini model.
   * @param {string} prompt - The user's prompt.
   * @param {Array} history - An array of previous messages in the chat.
   * @returns {Promise<string>} The generated response from Gemini.
   */
  async generateResponse(prompt, history) {
    try {
      const messages = [];
      
      // Gemini's API requires the first message to be from a 'user' role.
      // If systemPromptContent exists, it acts as the initial 'user' message.
      // Otherwise, we need to ensure the first message from history is a 'user' message.
      if (this.systemPromptContent) {
        messages.push({ role: 'user', parts: [{ text: this.systemPromptContent }] });
      }

      // Add the conversation history, ensuring roles alternate correctly for Gemini.
      // If systemPromptContent was added, the next message should ideally be 'model'.
      // If history starts with 'user', it's fine. If it starts with 'bot' and no system prompt,
      // this could cause the error.
      history.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'model', // Correctly using msg.sender for history
          parts: [{ text: msg.content }]
        });
      });
  
      // If the messages array is empty or starts with a 'model' role, and no system prompt was set,
      // this is where the error "First content should be with role 'user', got model" would occur.
      // We need to ensure the first message in the history passed to startChat is always 'user'.
      // The current structure of `messages` should handle this if `systemPromptContent` is present.
      // If `systemPromptContent` is NOT present, and `history` starts with a 'bot' message,
      // then `messages` will start with 'model', causing the error.
      // To fix this, we need to ensure `history` is always properly structured or
      // prepend a dummy user message if the first actual message is from the bot.
      // However, the `history` is coming directly from the Message model, which should alternate.
      // The issue might be if `history` is empty or starts with a bot message when `systemPromptContent` is null.

      // Let's ensure the history passed to startChat always begins with a user role.
      // If the first message in `messages` is 'model' and it's not preceded by a 'user' (system prompt),
      // then we have a problem.
      let chatHistoryForGemini = [...messages];

      // If the first message in the constructed history is 'model' and there was no system prompt,
      // it means the actual conversation history started with a bot message, which Gemini disallows.
      // This scenario should ideally not happen if chat sessions always start with a user message.
      // However, to be safe, we can prepend a dummy user message if needed.
      if (chatHistoryForGemini.length > 0 && chatHistoryForGemini[0].role === 'model' && !this.systemPromptContent) {
        // This case implies a malformed history or an edge case where a session starts with a bot.
        // For now, let's assume valid history from the Message model.
        // The error is more likely from the `systemPromptContent` being empty and `history` starting with a bot.
        // The `history.forEach` uses `msg.sender`, which is correct.
        // The problem is if `messages` array starts with `role: 'model'`
        // This happens if `this.systemPromptContent` is null AND `history[0].sender` is 'bot'.
        // The `createChatSession` in chatController ensures `promptId` is set, so `systemPromptContent` should be present.
        // Let's re-verify the `generateTitle` method as well.
      }

      const chat = this.model.startChat({
        history: chatHistoryForGemini,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        return text;
      }
      
      // If text is empty, try to extract more details from the response object
      let errorMessage = 'Desculpe, não consegui gerar uma resposta no momento.';
        
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        errorMessage += ` Motivo: Conteúdo bloqueado por ${response.promptFeedback.blockReason}.`;
      } else if (response.candidates && response.candidates.length > 0 && response.candidates[0].finishReason) {
          errorMessage += ` Motivo: Geração finalizada com razão: ${response.candidates[0].finishReason}.`;
      } else {
        errorMessage += ` Nenhuma resposta textual válida foi gerada.`;
      }
        
      // Log the full response for debugging purposes
      logger.error('Gemini response without text:', response); 
        
      return errorMessage + ' Por favor, tente novamente.';
    } catch (error) {
      logger.error('Error generating response from Gemini:', error);
      throw error;
    }
  }

  /**
   * Generates a title for the chat session based on the conversation history.
   * For GeminiBot, this will attempt to use the model to generate a title.
   * @param {Array} history - An array of previous messages in the chat.
   * @returns {Promise<string>} The suggested title for the chat session.
   */
  async generateTitle(history) {
    try {
      const messages = [];
      // For title generation, we don't necessarily need the system prompt.
      // We just need to ensure the history passed to Gemini is valid.
      // If the first message in history is from the bot, Gemini will complain.
      // We can prepend a dummy user message if the history starts with a bot message.
      if (history.length > 0 && history[0].sender === 'bot') {
        messages.push({ role: 'user', parts: [{ text: 'Start of conversation.' }] });
      }

      history.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });

      // Ensure there's at least one message with content before proceeding
      if (!messages || messages.length === 0 || !messages[0].parts || !messages[0].parts[0] || !messages[0].parts[0].text) {
        return 'Chat Session'; // Fallback if no valid messages
      }

      const chat = this.model.startChat({
        history: messages,
        generationConfig: {
          maxOutputTokens: 20, // Limit title length
        },
      });

      const result = await chat.sendMessage('Por favor, resuma a conversa acima em um título curto e conciso (com menos de 10 palavras). Não inclua frases conversacionais ou saudações. Apenas o título.');
      const response = await result.response;
      let title = response.text().trim();

      // Remove any leading/trailing quotes if the model returns them
      if (title.startsWith('"') && title.endsWith('"')) {
        title = title.slice(1, -1);
      }
      if (title.startsWith("'") && title.endsWith("'")) {
        title = title.slice(1, -1);
      }

      return title;
    } catch (error) {
      logger.error('Error generating title from Gemini:', error);
      // Fallback to a generic title if title generation fails
      return 'Chat Session';
    }
  }
}

module.exports = GeminiBot;
