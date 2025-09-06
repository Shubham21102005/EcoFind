import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import { FiUser } from 'react-icons/fi';

const MessageBubbles = ({ messages, loading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mb-4">
          <FiUser className="w-8 h-8 text-secondary-400" />
        </div>
        <h3 className="text-lg font-medium text-secondary-900 mb-2">No messages yet</h3>
        <p className="text-secondary-600 text-sm">
          Start the conversation by sending a message
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.sender._id === user._id;
        const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
        
        return (
          <div
            key={message._id || index}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              {!isOwnMessage && (
                <div className="flex-shrink-0 mr-2">
                  {showAvatar ? (
                    message.sender.profilePic ? (
                      <img
                        src={message.sender.profilePic}
                        alt={message.sender.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-secondary-300 rounded-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-secondary-600" />
                      </div>
                    )
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                {!isOwnMessage && showAvatar && (
                  <span className="text-xs text-secondary-500 mb-1">
                    {message.sender.username}
                  </span>
                )}
                
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-secondary-900 border border-secondary-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                
                <span className="text-xs text-secondary-500 mt-1">
                  {formatDate(message.timestamp)}
                </span>
              </div>

              {/* Own message avatar placeholder */}
              {isOwnMessage && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageBubbles;