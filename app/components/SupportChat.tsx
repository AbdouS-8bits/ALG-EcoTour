'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSupport } from '@/app/contexts/SupportContext';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

export default function SupportChat() {
  // Only fetch session once when component mounts
  const { data: session, status } = useSession();
  const { session: supportSession, isConnected, connectSocket, startSession, sendMessage, closeSession, startTyping, stopTyping } = useSupport();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-fill user data if logged in - only run once when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserName(session.user.name || '');
      setUserEmail(session.user.email || '');
    }
  }, [session, status]);

  // Connect socket when chat is opened
  useEffect(() => {
    if (isOpen && !isConnected) {
      connectSocket();
    }
  }, [isOpen, isConnected, connectSocket]);

  // Auto-start session for logged-in users - with guard to prevent multiple calls
  const autoStartSession = useCallback(() => {
    if (
      isOpen && 
      isConnected && 
      supportSession.status === 'idle' && 
      status === 'authenticated' && 
      session?.user &&
      !sessionStarted
    ) {
      setSessionStarted(true);
      startSession({
        userId: session.user.id || `user-${Date.now()}`,
        userName: session.user.name || 'Guest User',
        userEmail: session.user.email || 'no-email@example.com',
      });
    }
  }, [isOpen, isConnected, supportSession.status, status, session, sessionStarted, startSession]);

  useEffect(() => {
    autoStartSession();
  }, [autoStartSession]);

  // Reset sessionStarted when chat is closed
  useEffect(() => {
    if (!isOpen && sessionStarted) {
      setSessionStarted(false);
    }
  }, [isOpen, sessionStarted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [supportSession.messages]);

  const handleStartSession = () => {
    if (userName.trim() && userEmail.trim()) {
      setSessionStarted(true);
      startSession({
        userId: session?.user?.id || `user-${Date.now()}`,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
      });
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && supportSession.status === 'active') {
      sendMessage(inputMessage.trim());
      setInputMessage('');
      stopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Start typing
    if (e.target.value.trim()) {
      startTyping();

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    if (supportSession.status === 'active' || supportSession.status === 'waiting') {
      closeSession();
    }
    setIsOpen(false);
    setSessionStarted(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  // Only check if user is NOT authenticated, don't check status constantly
  const isGuest = status === 'unauthenticated';
  const isLoading = status === 'loading';

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Support Chat</h3>
            {!isConnected && (
              <p className="text-xs text-yellow-200">Connecting...</p>
            )}
            {isConnected && supportSession.status === 'waiting' && (
              <p className="text-xs text-green-100">Waiting for agent...</p>
            )}
            {isConnected && supportSession.status === 'active' && supportSession.agentName && (
              <p className="text-xs text-green-100">Chat with {supportSession.agentName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-green-700 p-1 rounded"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleClose}
            className="hover:bg-green-700 p-1 rounded"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Content */}
          {supportSession.status === 'idle' && (isGuest || isLoading) && (
            <div className="p-6 space-y-4">
              <h4 className="font-semibold text-gray-800">Start a Support Session</h4>
              <p className="text-sm text-gray-600">
                Please provide your details to connect with a support agent.
              </p>
              {!isConnected && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
                  Connecting to support system...
                </div>
              )}
              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleStartSession}
                disabled={!userName.trim() || !userEmail.trim() || !isConnected}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-colors"
              >
                {isConnected ? 'Start Chat' : 'Connecting...'}
              </button>
            </div>
          )}

          {/* Loading state for logged-in users */}
          {supportSession.status === 'idle' && status === 'authenticated' && session?.user && isConnected && !sessionStarted && (
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h4 className="font-semibold text-gray-800">Starting your session...</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Welcome back, {session.user.name}! 
                </p>
              </div>
            </div>
          )}

          {(supportSession.status === 'waiting' || supportSession.status === 'active' || supportSession.status === 'closed') && (
            <>
              {/* Messages */}
              <div className="h-[440px] overflow-y-auto p-4 space-y-3 bg-gray-50">
                {/* Welcome message for logged-in users */}
                {status === 'authenticated' && session?.user && supportSession.messages.length === 0 && supportSession.status === 'waiting' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Welcome back, {session.user.name}!</span>
                      <br />
                      An agent will be with you shortly.
                    </p>
                  </div>
                )}

                {supportSession.status === 'waiting' && (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <div className="animate-pulse">Connecting you with an agent...</div>
                  </div>
                )}

                {supportSession.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-4 py-2 ${
                        msg.senderType === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      {msg.senderType === 'agent' && (
                        <p className="text-xs font-semibold mb-1 text-green-600">
                          {msg.senderName}
                        </p>
                      )}
                      <p className="text-sm break-words">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderType === 'user' ? 'text-green-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {supportSession.isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {supportSession.status === 'closed' && (
                  <div className="text-center text-gray-500 text-sm py-4 bg-gray-100 rounded-lg">
                    This support session has been closed.
                    {status === 'authenticated' && session?.user && (
                      <p className="mt-2">
                        <button
                          onClick={() => {
                            setSessionStarted(false);
                            window.location.reload();
                          }}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Start a new session
                        </button>
                      </p>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {supportSession.status === 'active' && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                      aria-label="Send message"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
