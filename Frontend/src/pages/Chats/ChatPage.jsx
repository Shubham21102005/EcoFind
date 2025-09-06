import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';

// Custom SVG Icons
const MessageIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

const ChatPage = () => {
  const { user } = useAuth();
  const { chats } = useChat();
  const [selectedChatId, setSelectedChatId] = useState(null);
  
  const selectedChat = chats.find(chat => chat._id === selectedChatId);

  if (!user) {
    return (
      <div className="min-h-screen bg-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <MessageIcon className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-emerald-900 mb-4">Please login to access messages</h1>
            <p className="text-emerald-700">You need to be logged in to view your conversations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <LeafIcon className="w-8 h-8 text-emerald-600 mr-2" />
            <h1 className="text-3xl font-bold text-emerald-900">Eco Conversations</h1>
          </div>
          <p className="text-emerald-700">Connect with sustainable buyers and sellers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
          <div className="flex h-[600px]">
            {/* Chat List - Desktop */}
            <div className="hidden md:block w-1/3 border-r border-emerald-200 bg-emerald-50/30">
              <div className="p-4 border-b border-emerald-200 bg-emerald-100/50">
                <div className="flex items-center">
                  <MessageIcon className="w-5 h-5 text-emerald-600 mr-2" />
                  <h2 className="text-lg font-semibold text-emerald-900">Conversations</h2>
                </div>
              </div>
              <div className="p-4 h-full overflow-y-auto">
                <ChatList
                  onChatSelect={setSelectedChatId}
                  selectedChatId={selectedChatId}
                />
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedChatId ? (
                <ChatWindow
                  chatId={selectedChatId}
                  chat={selectedChat}
                  onBack={() => setSelectedChatId(null)}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-emerald-50/20">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageIcon className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-medium text-emerald-900 mb-3">
                      Select a conversation
                    </h3>
                    <p className="text-emerald-700 mb-6 max-w-md mx-auto">
                      Choose a conversation from the list to start chatting about sustainable products
                    </p>
                    <div className="bg-emerald-100/50 p-4 rounded-xl border border-emerald-200 max-w-md mx-auto">
                      <h4 className="text-sm font-medium text-emerald-800 mb-2 flex items-center">
                        <LeafIcon className="w-4 h-4 mr-1" />
                        Eco-friendly chatting tips
                      </h4>
                      <ul className="text-xs text-emerald-700 text-left space-y-1">
                        <li>• Discuss sustainable packaging options</li>
                        <li>• Share information about product origins</li>
                        <li>• Coordinate local pickup to reduce shipping emissions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Chat List */}
          <div className="md:hidden">
            {!selectedChatId ? (
              <div className="p-4 bg-emerald-50/30">
                <div className="flex items-center mb-4">
                  <MessageIcon className="w-5 h-5 text-emerald-600 mr-2" />
                  <h2 className="text-lg font-semibold text-emerald-900">Conversations</h2>
                </div>
                <ChatList
                  onChatSelect={setSelectedChatId}
                  selectedChatId={selectedChatId}
                />
              </div>
            ) : (
              <ChatWindow
                chatId={selectedChatId}
                chat={selectedChat}
                onBack={() => setSelectedChatId(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;