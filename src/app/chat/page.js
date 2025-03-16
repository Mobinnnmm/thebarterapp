"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import io from 'socket.io-client';

export default function ChatPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const [conversations, setConversations] = useState([]);
  
  // Add a messages ref to track latest messages
  const messagesRef = useRef([]);
  const messagesEndRef = useRef(null);  // Add this ref for auto-scrolling

  // Initialize socket connection
  useEffect(() => {
    if (user && roomId) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/messages?chatId=${roomId}`);
          if (!response.ok) throw new Error('Failed to fetch messages');
          const data = await response.json();
          setMessages(data);
          messagesRef.current = data;  // Keep track of current messages
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        }
      };
      
      fetchMessages();

      // Update socket connection to use environment variable
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3003', {
        path: '/api/socketio',
        query: { userId: user._id, roomId },
        transports: ['polling', 'websocket'],
        withCredentials: false,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      socket.on('receiveMessage', (message) => {
        console.log('Received message:', message);
        // Use the ref to check for duplicates
        if (!messagesRef.current.some(m => m._id === message._id)) {
          setMessages(prev => {
            const newMessages = [...prev, message];
            messagesRef.current = newMessages;  // Update ref
            return newMessages;
          });
        }
      });

      socket.on('messageError', (error) => {
        console.error('Message error:', error);
        // Optionally show error to user
      });

      setSocket(socket);
      fetchChatInfo();

      return () => {
        socket.disconnect();
      };
    }
  }, [user, roomId]);

  // Add a new useEffect to fetch conversations
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Add this function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add useEffect for auto-scrolling when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatInfo = async () => {
    try {
      const response = await fetch(`/api/chat/${roomId}`);
      const data = await response.json();
      setChatInfo(data);
    } catch (error) {
      console.error('Error fetching chat info:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/chat/user?userId=${user._id}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && roomId) {
      const messageData = {
        content: newMessage,
        senderId: user._id,
        chatId: roomId,
        timestamp: new Date(),
        isRead: false
      };

      try {
        setNewMessage(''); // Clear input immediately
        // Send directly through socket instead of REST API
        socket.emit('sendMessage', messageData);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-8rem)] bg-gray-800/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50 shadow-xl">
          {/* Left Sidebar */}
          <div className="w-80 border-r border-gray-700/50 flex flex-col bg-gray-800/20">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-700/50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((chat) => {
                const otherUser = user._id === chat.proposer._id ? chat.proposee : chat.proposer;
                
                return (
                  <div
                    key={chat.roomId}
                    className={`group p-4 hover:bg-gray-700/30 cursor-pointer flex items-center space-x-4 transition-all ${
                      chat.roomId === roomId ? 'bg-gray-700/50 border-l-4 border-indigo-500' : ''
                    }`}
                    onClick={() => {
                      window.location.href = `/chat?roomId=${chat.roomId}`;
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors">
                          {otherUser.username}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {chat.listingId.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-800/10">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
              {chatInfo && (
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-200">
                      {user._id === chatInfo.proposer._id ? chatInfo.proposee.username : chatInfo.proposer.username}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Regarding: {chatInfo.listingId?.title || 'Loading...'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId._id === user._id;
                const messageTime = new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isCurrentUser && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-gray-300">
                          👤
                        </div>
                      </div>
                    )}

                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      {!isCurrentUser && (
                        <span className="text-xs text-gray-500 mb-1">
                          {message.senderId.username}
                        </span>
                      )}
                      
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isCurrentUser
                            ? 'bg-indigo-500/80 backdrop-blur-sm text-white'
                            : 'bg-gray-700/50 backdrop-blur-sm text-gray-200'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {messageTime}
                        </p>
                      </div>
                    </div>

                    {isCurrentUser && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm">
                          Me
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
              <form onSubmit={sendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
