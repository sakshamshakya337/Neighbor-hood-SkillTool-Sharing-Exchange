import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { Send, ArrowLeft, MessageSquare } from 'lucide-react';

const ENDPOINT = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:5000") : "";

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.current = io(ENDPOINT, { withCredentials: true });
    
    if (user) {
      socket.current.emit("setup", user);
      socket.current.on("connected", () => setSocketConnected(true));
      socket.current.on("typing", () => setIsTyping(true));
      socket.current.on("stop typing", () => setIsTyping(false));
    }

    return () => {
      socket.current?.disconnect();
      setSocketConnected(false);
    };
  }, [user?._id]);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (location.state?.chatId) {
      const chat = chats.find(c => c._id === location.state.chatId);
      if (chat) {
        setSelectedChat(chat);
      } else {
        // If chat isn't in the list yet, we fetch it or it will populate when fetchChats completes
      }
    }
  }, [location.state, chats]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/api/chat");
      setChats(data);
      if (location.state?.chatId && !selectedChat) {
        const found = data.find(c => c._id === location.state.chatId);
        if (found) setSelectedChat(found);
      }
    } catch (error) {
      console.error("Failed to load chats", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const { data } = await api.get(`/api/chat/${selectedChat._id}`);
      setMessages(data);
      socket.current.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (!socketConnected) return;

    const messageListener = (newMessageReceived) => {
      const receivedChatId =
        typeof newMessageReceived.chatId === 'string'
          ? newMessageReceived.chatId
          : newMessageReceived.chatId?._id;

      if (!selectedChat || selectedChat._id !== receivedChatId) {
        // Notification logic or update chat list for unread messages
        fetchChats();
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
      
      // Update chat list to show latest message
      fetchChats();
    };

    socket.current?.on("message received", messageListener);

    return () => {
      socket.current?.off("message received", messageListener);
    };
  }, [selectedChat, socketConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (!selectedChat || !newMessage.trim()) return;
      socket.current?.emit("stop typing", selectedChat._id);
      
      const messageContent = newMessage;
      setNewMessage("");
      
      try {
        const { data } = await api.post("/api/chat/message", {
          content: messageContent,
          chatId: selectedChat._id,
        });
        
        socket.current?.emit("new message", data);
        setMessages((prev) => {
          if (prev.some((m) => m._id === data._id)) return prev;
          return [...prev, data];
        });
        fetchChats(); // Update last message in chat list
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !selectedChat) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", selectedChat._id);
    }
    
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.current.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const getOtherUser = (participants) => {
    return participants.find(p => p._id !== user._id);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] max-w-6xl">
      <div className="flex bg-white rounded-2xl shadow-xl h-full overflow-hidden border border-outline-variant/30">
        
        {/* Chat List Sidebar */}
        <div className={`w-full md:w-1/3 border-r border-outline-variant/30 flex flex-col bg-slate-50/50 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-outline-variant/30 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="text-2xl font-headline font-black text-primary">Messages</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Your recent conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-8 text-on-surface-variant text-center mt-10 flex flex-col items-center gap-3 opacity-60">
                <MessageSquare className="w-12 h-12" />
                <p>No conversations yet</p>
              </div>
            ) : (
              chats.map((chat) => {
                const otherUser = getOtherUser(chat.participants);
                const isSelected = selectedChat?._id === chat._id;
                return (
                  <div 
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 mx-2 my-1 rounded-xl cursor-pointer transition-all duration-200 group ${isSelected ? 'bg-primary shadow-md text-white' : 'hover:bg-white hover:shadow-sm'}`}
                  >
                    <div className={`font-bold ${isSelected ? 'text-white' : 'text-on-surface'}`}>{otherUser?.name || 'Unknown User'}</div>
                    {chat.lastMessage && (
                      <div className={`text-sm truncate mt-1 ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                        {chat.lastMessage.senderId._id === user._id ? "You: " : ""}
                        {chat.lastMessage.text}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex flex-col bg-white relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant flex-col gap-5 bg-slate-50/50">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-primary/50" />
              </div>
              <p className="text-xl font-headline font-bold text-on-surface">Your Messages</p>
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-outline-variant/30 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center gap-4 shadow-sm">
                <button 
                  className="md:hidden p-2 rounded-full hover:bg-surface-container transition-colors"
                  onClick={() => setSelectedChat(null)}
                >
                  <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {(getOtherUser(selectedChat.participants)?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold font-headline text-lg text-on-surface">
                      {getOtherUser(selectedChat.participants)?.name || 'Unknown User'}
                    </div>
                    <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {messages.map((m) => {
                  const isMine = m.senderId._id === user._id;
                  return (
                    <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                        isMine 
                          ? 'bg-gradient-to-br from-primary to-blue-600 text-white rounded-tr-sm' 
                          : 'bg-white text-on-surface rounded-tl-sm border border-outline-variant/20'
                      }`}>
                        <p className="text-[15px] leading-relaxed">{m.text}</p>
                        <p className={`text-[10px] mt-2 font-medium text-right ${isMine ? 'text-white/70' : 'text-on-surface-variant'}`}>
                          {format(new Date(m.createdAt), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-outline-variant/20 shadow-sm rounded-2xl rounded-tl-sm px-5 py-3 text-on-surface-variant text-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/80 backdrop-blur-md border-t border-outline-variant/30 flex items-center gap-3">
                <input
                  type="text"
                  className="flex-1 bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full px-5 py-3.5 outline-none transition-all shadow-sm text-sm"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                />
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-primary to-blue-600 text-white p-3.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none transition-all duration-200"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
