'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  sessionId: string;
  message: string;
  senderType: 'user' | 'agent';
  senderName: string;
  timestamp: string;
}

interface SupportSession {
  sessionId?: string;
  status: 'idle' | 'waiting' | 'active' | 'closed';
  agentName?: string;
  agentId?: string;
  messages: Message[];
  isTyping: boolean;
}

interface SupportContextType {
  socket: Socket | null;
  session: SupportSession;
  isConnected: boolean;
  connectSocket: () => void;
  startSession: (userData: { userId: string; userName: string; userEmail: string }) => void;
  sendMessage: (message: string) => void;
  closeSession: () => void;
  startTyping: () => void;
  stopTyping: () => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [session, setSession] = useState<SupportSession>({
    status: 'idle',
    messages: [],
    isTyping: false,
  });

  const connectSocket = useCallback(() => {
    if (socket) return; // Already connected

    try {
      const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketInstance.on('connect', () => {
        console.log('Connected to support socket');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from support socket');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Session created
      socketInstance.on('session:created', (data: { sessionId: string }) => {
        setSession(prev => ({
          ...prev,
          sessionId: data.sessionId,
          status: 'waiting',
        }));
      });

      // Agent joined
      socketInstance.on('agent:joined', (data: { agentName: string; agentId: string }) => {
        setSession(prev => ({
          ...prev,
          status: 'active',
          agentName: data.agentName,
          agentId: data.agentId,
        }));
      });

      // Message received
      socketInstance.on('message:received', (message: Message) => {
        setSession(prev => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      });

      // Typing indicator
      socketInstance.on('user:typing', (data: { name?: string; isTyping: boolean }) => {
        setSession(prev => ({
          ...prev,
          isTyping: data.isTyping,
        }));
      });

      // Agent disconnected
      socketInstance.on('agent:disconnected', (data: { message: string }) => {
        setSession(prev => ({
          ...prev,
          status: 'waiting',
          agentId: undefined,
          agentName: undefined,
        }));
      });

      // Session closed
      socketInstance.on('session:closed', () => {
        setSession(prev => ({
          ...prev,
          status: 'closed',
        }));
      });

      setSocket(socketInstance);
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setIsConnected(false);
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const startSession = (userData: { userId: string; userName: string; userEmail: string }) => {
    if (!socket) {
      console.error('Socket not connected');
      return;
    }
    socket.emit('support:start', userData);
  };

  const sendMessage = (message: string) => {
    if (socket && session.sessionId) {
      socket.emit('message:send', {
        sessionId: session.sessionId,
        message,
        senderType: 'user',
        senderName: 'You',
      });
    }
  };

  const closeSession = () => {
    if (socket && session.sessionId) {
      socket.emit('session:close', { sessionId: session.sessionId });
    }
  };

  const startTyping = () => {
    if (socket && session.sessionId) {
      socket.emit('typing:start', {
        sessionId: session.sessionId,
        name: 'User',
      });
    }
  };

  const stopTyping = () => {
    if (socket && session.sessionId) {
      socket.emit('typing:stop', {
        sessionId: session.sessionId,
      });
    }
  };

  return (
    <SupportContext.Provider
      value={{
        socket,
        session,
        isConnected,
        connectSocket,
        startSession,
        sendMessage,
        closeSession,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
}
