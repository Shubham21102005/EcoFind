import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

export const useChat = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  // Get all user chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatApi.getUserChats();
      setChats(response);
    } catch (error) {
      toast.error('Failed to fetch chats');
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get messages for a specific chat
  const fetchMessages = async (chatId) => {
    try {
      setLoading(true);
      const response = await chatApi.getMessages(chatId);
      setMessages(response);
      setCurrentChatId(chatId);
    } catch (error) {
      toast.error('Failed to fetch messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (text) => {
    if (!currentChatId || !text.trim()) return;

    try {
      const response = await chatApi.sendMessage(currentChatId, text);
      
      // Add message to local state immediately
      setMessages(prev => [...prev, response]);
      
      // Emit socket event
      if (socket) {
        socket.emit('sendMessage', {
          chatId: currentChatId,
          message: response,
        });
      }
      
      return response;
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Create or get chat with seller
  const createOrGetChat = async (sellerId, productId = null) => {
    try {
      const response = await chatApi.createOrGetChat(sellerId, productId);
      
      // Refresh chats list
      await fetchChats();
      
      // Open the new/existing chat
      await fetchMessages(response._id);
      
      return response;
    } catch (error) {
      toast.error('Failed to create chat');
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (data) => {
        if (data.chatId === currentChatId) {
          setMessages(prev => [...prev, data.message]);
        }
        
        // Update chat list to show latest message
        setChats(prev => 
          prev.map(chat => 
            chat._id === data.chatId 
              ? { ...chat, lastMessage: data.message }
              : chat
          )
        );
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, currentChatId]);

  return {
    chats,
    messages,
    currentChatId,
    loading,
    fetchChats,
    fetchMessages,
    sendMessage,
    createOrGetChat,
  };
};