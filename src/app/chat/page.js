"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import io from 'socket.io-client';

// Create a wrapper component that handles search params
function ChatWrapper() {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (searchParams) {
      const id = searchParams.get('roomId');
      setRoomId(id);
    }
  }, [searchParams]);

  return <ChatContent roomId={roomId} />;
}

// Main chat component that doesn't directly use useSearchParams
function ChatContent({ roomId }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const [conversations, setConversations] = useState([]);
  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  // Add loading state for messages
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  
  // Add a messages ref to track latest messages
  const messagesRef = useRef([]);
  const messagesEndRef = useRef(null);  // Add this ref for auto-scrolling

  // Initialize socket connection
  useEffect(() => {
    if (user && roomId) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        try {
          const response = await fetch(`/api/messages?chatId=${roomId}`);
          if (!response.ok) throw new Error('Failed to fetch messages');
          const data = await response.json();
          setMessages(data);
          messagesRef.current = data;  // Keep track of current messages
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      
      fetchMessages();

      // Log environment information
      console.log("Environment:", {
        NEXT_PUBLIC_SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
        isProduction: process.env.NODE_ENV === 'production',
        currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'unknown'
      });
      // stack overflow
      const serverUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 
        (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:3000' 
          : 'https://barter-socket-server.onrender.com');

      console.log("Attempting to connect to socket server at:", serverUrl);
      
      const socket = io(serverUrl, {
        path: '/api/socketio',
        query: { userId: user._id, roomId },
        transports: ['websocket', 'polling'],
        withCredentials: false,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      // Add more detailed logging for debugging
      socket.on('connect', () => {
        console.log('Connected to socket server', socket.id);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        console.error('Socket connection error details:', {
          error,
          transport: socket.io.engine.transport.name,
          url: socket.io.uri,
          opts: socket.io.opts,
          readyState: socket.io.readyState
        });
        
        // stack overflow
        // Attempt to reconnect with different transport if websocket fails
        if (socket.io.engine.transport.name === 'websocket') {
          console.log('Websocket transport failed, falling back to polling');
          socket.io.engine.transport.close();
        }
      });

      socket.on('receiveMessage', (message) => {
        console.log('Received message:', message);
        
        setMessages(prev => {
          // First, check if we already have this exact message by ID
          if (prev.some(m => !m.isTemp && m._id === message._id)) {
            console.log('Ignoring duplicate message with ID:', message._id);
            return prev; // Already have this message, don't add it
          }
          
          // Next, check if this is a server confirmation of our temporary message
          const tempIndex = prev.findIndex(m => 
            m.isTemp && message.tempId && m._id === message.tempId
          );
          
          if (tempIndex >= 0) {
            console.log('Replacing temp message with server message');
            // Replace the temporary message with the server version
            const newMessages = [...prev];
            newMessages[tempIndex] = message;
            messagesRef.current = newMessages;
            return newMessages;
          }
          
          // It's a completely new message, add it
          console.log('Adding new message from server');
          const newMessages = [...prev, message];
          messagesRef.current = newMessages;
          return newMessages;
        });
      });

      socket.on('messageError', (error) => {
        console.error('Message error:', error);
        
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

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(chat => {
    const otherUser = user?._id === chat.proposer?._id ? chat.proposee : chat.proposer;
    const username = otherUser?.username?.toLowerCase() || '';
    const listingTitle = chat.listingId?.title?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return username.includes(query) || listingTitle.includes(query);
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && roomId) {
      
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const messageData = {
        content: newMessage,
        senderId: user._id,
        chatId: roomId,
        timestamp: new Date(),
        isRead: false,
        tempId: tempId // Include tempId for tracking
      };

      try {
        console.log('Sending message with tempId:', tempId);
        setNewMessage(''); // Clear input immediately
        
        // Create a temporary message for immediate display
        const tempMessage = {
          _id: tempId, // Use tempId as the _id for now
          content: messageData.content,
          senderId: { _id: user._id, username: user.username },
          chatId: roomId,
          timestamp: new Date(),
          isRead: false,
          isTemp: true 
        };
        
        // Send to server
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((chat) => {
                  const otherUser = user._id === chat.proposer._id ? chat.proposee : chat.proposer;
                  
                  return (
                    <div
                      key={chat.roomId}
                      className={`group p-4 hover:bg-gray-700/30 cursor-pointer flex items-center space-x-4 transition-all ${
                        chat.roomId === roomId ? 'bg-blue-900 border-l-4 border-indigo-500 shadow-lg' : ''
                      }`}
                      onClick={() => {
                        window.location.href = `/chat?roomId=${chat.roomId}`;
                      }}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        chat.roomId === roomId 
                          ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 ring-2 ring-indigo-400'
                          : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10'
                      }`}>
                        👤
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className={`font-semibold transition-colors ${
                            chat.roomId === roomId 
                              ? 'text-indigo-300' 
                              : 'text-gray-200 group-hover:text-indigo-400'
                          }`}>
                            {otherUser.username}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(chat.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          chat.roomId === roomId ? 'text-gray-300' : 'text-gray-400'
                        } truncate`}>
                          {chat.listingId.title}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-gray-400">
                  {searchQuery ? "No conversations match your search" : "No conversations yet"}
                </div>
              )}
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
              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full">
                  {/* <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-3"></div> */}
                  <p className="text-gray-400">Please select a Chat...</p>
                </div>
              ) : messages.length > 0 ? (
                messages.map((message, index) => {
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
                          className={`max-w-[100%] rounded-lg p-3 ${
                            isCurrentUser
                              ? 'bg-indigo-500/80 backdrop-blur-sm text-white'
                              : 'bg-gray-700/50 backdrop-blur-sm text-gray-200'
                          }`}
                        >
                          <p className="whitespace-normal break-words overflow-hidden">{message.content}</p>
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
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-gray-400 text-center">
                    <p className="mb-2">No messages yet</p>
                    <p className="text-sm">Start the conversation by sending a message below</p>
                  </div>
                </div>
              )}
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

// Loading component
function LoadingView() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Main export with Suspense boundary
export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <ChatWrapper />
    </Suspense>
  );
}
