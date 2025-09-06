import React, { useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

// Custom SVG Icons
const MessageIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LeafIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7.84 19.84a10 10 0 0 1-3.47-3.17 10 10 0 0 1-1.37-9.67 10 10 0 0 1 9.67-1.37 10 10 0 0 1 3.17 3.47" />
    <path d="M8.5 15.5c.5.5 1 1 1.5 1.5s1 1 1.5 1.5" />
    <path d="M16 8c-1.5 1.5-3 3-4.5 4.5" />
    <path d="M14 14c1.5-1.5 3-3 4.5-4.5" />
    <path d="M9.5 9.5 15 15" />
    <path d="M15 9.5 9.5 15" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-emerald-200"></div>
      <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
    </div>
  </div>
);

const ChatList = ({ onChatSelect, selectedChatId }) => {
  const { chats, fetchChats, loading } = useChat();
  const { user } = useAuth();

  useEffect(() => {
    fetchChats();
  }, []);

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user._id);
  };

  const getLastMessage = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      return chat.messages[chat.messages.length - 1];
    }
    return null;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="bg-emerald-100 p-4 rounded-full mb-4">
          <MessageIcon className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-lg font-medium text-emerald-900 mb-2">No conversations yet</h3>
        <p className="text-emerald-700 text-sm mb-4">
          Start a conversation by clicking "Chat with Seller" on any product
        </p>
        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 max-w-xs">
          <p className="text-xs text-emerald-700 flex items-center">
            <LeafIcon className="w-3 h-3 mr-1" />
            Connect with eco-conscious buyers and sellers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2">
      {chats.map((chat) => {
        const otherParticipant = getOtherParticipant(chat);
        const lastMessage = getLastMessage(chat);
        const isSelected = selectedChatId === chat._id;
        
        return (
          <div
            key={chat._id}
            onClick={() => onChatSelect(chat._id)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'bg-emerald-50 border-l-4 border-emerald-500 shadow-sm'
                : 'bg-white hover:bg-emerald-50/50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {otherParticipant?.profilePic ? (
                  <img
                    src={otherParticipant.profilePic}
                    alt={otherParticipant.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200">
                    <UserIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-emerald-900 truncate">
                    {otherParticipant?.username || 'Unknown User'}
                  </h3>
                  {lastMessage && (
                    <span className="text-xs text-emerald-600 whitespace-nowrap">
                      {formatDate(lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                
                {chat.product && (
                  <div className="flex items-center mb-1">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      Re: {chat.product.title}
                    </span>
                  </div>
                )}
                
                {lastMessage ? (
                  <p className="text-sm text-emerald-700 truncate mt-1">
                    <span className={lastMessage.sender._id === user._id ? "font-medium text-emerald-800" : "text-emerald-600"}>
                      {lastMessage.sender._id === user._id ? 'You: ' : ''}
                    </span>
                    {lastMessage.text}
                  </p>
                ) : (
                  <p className="text-sm text-emerald-500 italic mt-1">
                    No messages yet. Start the conversation!
                  </p>
                )}
              </div>

              {/* Online indicator */}
              {otherParticipant?.isOnline && (
                <div className="flex-shrink-0 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              )}
            </div>

            {/* Eco-friendly product indicator */}
            {chat.product?.ecoFriendly && (
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  <LeafIcon className="w-3 h-3 mr-1" />
                  Eco-friendly product
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;