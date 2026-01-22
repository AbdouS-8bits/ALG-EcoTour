'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { Users, MessageSquare, Clock, CheckCircle, XCircle, Send, User, Mail, Shield } from 'lucide-react';

interface Message {
  id: string;
  sessionId: string;
  message: string;
  senderType: 'user' | 'agent';
  senderName: string;
  timestamp: string;
}

interface SupportSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  agentId?: string;
  agentName?: string;
  startedAt: Date;
  status: 'waiting' | 'active' | 'closed';
  messages?: Message[];
}

export default function AgentDashboard() {
  const { data: session, status: authStatus } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [waitingSessions, setWaitingSessions] = useState<SupportSession[]>([]);
  const [activeSessions, setActiveSessions] = useState<SupportSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineAgents, setOnlineAgents] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill agent data if logged in as admin
  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user) {
      setAgentName(session.user.name || '');
      setAgentEmail(session.user.email || '');
      
      // Auto-login if user is admin or has support role
      if (session.user.role === 'admin' || session.user.role === 'support') {
        console.log('Auto-logging in agent:', session.user.name);
        setIsLoggedIn(true);
      }
    }
  }, [session, authStatus]);

  useEffect(() => {
    if (isLoggedIn && agentName && agentEmail) {
      console.log('🔌 Initializing socket connection for agent:', agentName);
      
      const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
      });

      socketInstance.on('connect', () => {
        console.log('✅ Agent connected to socket:', socketInstance.id);
        
        const agentData = {
          agentId: session?.user?.id || `agent-${Date.now()}`,
          name: agentName,
          email: agentEmail,
        };
        
        console.log('📤 Emitting agent:join with:', agentData);
        socketInstance.emit('agent:join', agentData);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
      });

      // Receive waiting sessions
      socketInstance.on('waiting-sessions', (sessions: SupportSession[]) => {
        console.log('📥 Received waiting sessions:', sessions.length, sessions);
        setWaitingSessions(sessions);
      });

      // New support request
      socketInstance.on('new-support-request', (newSession: SupportSession) => {
        console.log('🆕 New support request received:', newSession);
        setWaitingSessions(prev => {
          const exists = prev.some(s => s.id === newSession.id);
          if (exists) {
            console.log('Session already in list');
            return prev;
          }
          console.log('Adding new session to waiting list');
          return [...prev, newSession];
        });
      });

      // Session status changed
      socketInstance.on('session:status-changed', (data: {
        sessionId: string;
        status: string;
        agentName?: string;
        session?: SupportSession;
      }) => {
        console.log('📊 Session status changed:', data);
        
        if (data.status === 'active') {
          // Remove from waiting list
          setWaitingSessions(prev => {
            const filtered = prev.filter(s => s.id !== data.sessionId);
            console.log('Removed from waiting. Remaining:', filtered.length);
            return filtered;
          });
          
          // If this agent accepted it, add to active sessions
          if (data.agentName === agentName && data.session) {
            console.log('This agent accepted the session, adding to active');
            setActiveSessions(prevActive => {
              // Avoid duplicates
              const exists = prevActive.some(s => s.id === data.sessionId);
              if (exists) {
                return prevActive.map(s => 
                  s.id === data.sessionId ? data.session! : s
                );
              }
              return [...prevActive, data.session!];
            });
            
            // Auto-select the newly accepted session
            setSelectedSession(data.sessionId);
          }
        }
      });

      // Message received
      socketInstance.on('message:received', (message: Message) => {
        console.log('💬 Message received:', message);
        setActiveSessions(prev =>
          prev.map(sess =>
            sess.id === message.sessionId
              ? { ...sess, messages: [...(sess.messages || []), message] }
              : sess
          )
        );
      });

      // Agent status updates
      socketInstance.on('agent-status', (data: { type: string; agent?: any }) => {
        console.log('👥 Agent status update:', data);
        if (data.type === 'online') {
          setOnlineAgents(prev => prev + 1);
        } else if (data.type === 'offline') {
          setOnlineAgents(prev => Math.max(0, prev - 1));
        }
      });

      // Session closed
      socketInstance.on('session:closed', (data: { sessionId: string }) => {
        console.log('🔒 Session closed:', data.sessionId);
        setActiveSessions(prev =>
          prev.map(s =>
            s.id === data.sessionId ? { ...s, status: 'closed' as const } : s
          )
        );
      });

      setSocket(socketInstance);

      return () => {
        console.log('🔌 Disconnecting socket');
        socketInstance.disconnect();
      };
    }
  }, [isLoggedIn, agentName, agentEmail, session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSessions, selectedSession]);

  const handleLogin = () => {
    if (agentName.trim() && agentEmail.trim()) {
      console.log('Agent logging in:', agentName);
      setIsLoggedIn(true);
    }
  };

  const handleAcceptSession = (sessionId: string) => {
    console.log('🎯 Accepting session:', sessionId);
    console.log('Socket connected:', !!socket);
    console.log('Socket ID:', socket?.id);
    
    if (socket) {
      console.log('📤 Emitting agent:accept-session');
      socket.emit('agent:accept-session', { sessionId });
    } else {
      console.error('❌ Socket not connected!');
    }
  };

  const handleSendMessage = () => {
    if (socket && selectedSession && inputMessage.trim()) {
      console.log('📤 Sending message:', inputMessage);
      socket.emit('message:send', {
        sessionId: selectedSession,
        message: inputMessage.trim(),
        senderType: 'agent',
        senderName: agentName,
      });
      setInputMessage('');
    }
  };

  const handleCloseSession = (sessionId: string) => {
    if (socket) {
      console.log('🔒 Closing session:', sessionId);
      socket.emit('session:close', { sessionId });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Agent Login</h1>
            <p className="text-gray-600">Sign in to access the support dashboard</p>
            
            {authStatus === 'authenticated' && session?.user && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Logged in as <span className="font-semibold">{session.user.name}</span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Your Name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Your Email"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={!agentName.trim() || !agentEmail.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeSession = activeSessions.find(s => s.id === selectedSession);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Support Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {agentName}</p>
            {socket && (
              <p className="text-xs text-green-600">Socket: {socket.connected ? '✅ Connected' : '❌ Disconnected'}</p>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">{onlineAgents} agents online</span>
            </div>
            {authStatus === 'authenticated' && session?.user && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">{session.user.role}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Waiting</p>
                <p className="text-3xl font-bold text-orange-600">{waitingSessions.length}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {activeSessions.filter(s => s.status === 'active').length}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Closed</p>
                <p className="text-3xl font-bold text-gray-600">
                  {activeSessions.filter(s => s.status === 'closed').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-gray-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Waiting Sessions */}
            {waitingSessions.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Waiting ({waitingSessions.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                  {waitingSessions.map((sess) => (
                    <div key={sess.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-gray-800">{sess.userName}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <p className="truncate">{sess.userEmail}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        Session ID: {sess.id}
                      </p>
                      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Waiting since {new Date(sess.startedAt).toLocaleTimeString()}
                      </p>
                      <button
                        onClick={() => handleAcceptSession(sess.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        Accept Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Sessions */}
            {activeSessions.filter(s => s.status === 'active').length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    My Active Chats ({activeSessions.filter(s => s.status === 'active').length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                  {activeSessions
                    .filter(s => s.status === 'active')
                    .map((sess) => (
                      <button
                        key={sess.id}
                        onClick={() => setSelectedSession(sess.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedSession === sess.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <p className="font-medium text-gray-800">{sess.userName}</p>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{sess.userEmail}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {sess.messages?.length || 0} messages
                        </p>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {waitingSessions.length === 0 && activeSessions.filter(s => s.status === 'active').length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No active sessions</p>
                <p className="text-sm text-gray-500 mt-2">Waiting for customers...</p>
                {socket && (
                  <p className="text-xs text-gray-400 mt-2">
                    Socket: {socket.connected ? 'Connected ✅' : 'Disconnected ❌'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedSession && activeSession ? (
              <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{activeSession.userName}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {activeSession.userEmail}
                      </p>
                    </div>
                  </div>
                  {activeSession.status === 'active' && (
                    <button
                      onClick={() => handleCloseSession(activeSession.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Close Session
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {activeSession.messages?.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  {activeSession.messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          msg.senderType === 'agent'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        {msg.senderType === 'user' && (
                          <p className="text-xs font-semibold mb-1 text-gray-600">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderType === 'agent' ? 'text-green-100' : 'text-gray-400'
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
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {activeSession.status === 'active' && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {activeSession.status === 'closed' && (
                  <div className="p-4 bg-gray-100 text-center text-gray-600">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    This session has been closed
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No chat selected</p>
                  <p className="text-sm">Select a chat from the list or accept a waiting session</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
