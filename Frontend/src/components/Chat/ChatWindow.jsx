import React, { useState, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import MessageBubbles from './MessageBubbles';
import Button from '../UI/Button';
import { FiSend, FiUser, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ChatWindow = ({ chatId, chat, onBack }) => {
  const { messages, sendMessage, fetchMessages, loading } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = () => {
    if (!chat || !chat.participants) return null;
    // Find the participant who is not the current user
    return chat.participants.find(participant => participant._id !== user._id);
  };

  const otherParticipant = getOtherParticipant();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          
          {otherParticipant && (
            <>
              {otherParticipant.profilePic ? (
                <img
                  src={otherParticipant.profilePic}
                  alt={otherParticipant.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-secondary-300 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-secondary-600" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-secondary-900">
                  {otherParticipant.username}
                </h3>
                <p className="text-sm text-secondary-500">Online</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageBubbles messages={messages} loading={loading} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-secondary-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={sending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            loading={sending}
            className="px-4 py-2"
          >
            <FiSend className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;