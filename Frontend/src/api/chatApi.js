import axiosInstance from '../utils/axiosInstance';

export const chatApi = {
  // Create or get chat between two users
  createOrGetChat: async (sellerId, productId = null) => {
    const response = await axiosInstance.post('/chats', {
      sellerId,
      productId,
    });
    return response.data;
  },

  // Send message
  sendMessage: async (chatId, text) => {
    const response = await axiosInstance.post('/chats/message', {
      chatId,
      text,
    });
    return response.data;
  },

  // Get messages for a chat
  getMessages: async (chatId) => {
    const response = await axiosInstance.get(`/chats/${chatId}/messages`);
    return response.data;
  },

  // Get all chats for current user
  getUserChats: async () => {
    const response = await axiosInstance.get('/chats');
    return response.data;
  },
};