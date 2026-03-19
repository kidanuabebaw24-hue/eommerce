import api from './api';

const aiService = {
  /**
   * Send a message to the AI Advisor
   * @param {string} message - User message
   * @param {number} productId - Optional product ID for context
   */
  sendMessage: async (message, productId = null) => {
    try {
      const response = await api.post('/ai/chat', { message, productId });
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
};

export default aiService;
