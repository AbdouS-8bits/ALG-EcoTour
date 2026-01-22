import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocketServer = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');

    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    // Store active support sessions
    const supportSessions = new Map<string, {
      userId: string;
      userName: string;
      userEmail: string;
      agentId?: string;
      agentName?: string;
      startedAt: Date;
      status: 'waiting' | 'active' | 'closed';
    }>();

    // Store online agents
    const onlineAgents = new Map<string, {
      id: string;
      name: string;
      email: string;
      activeSessions: string[];
    }>();

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Agent joins as support staff
      socket.on('agent:join', (data: { agentId: string; name: string; email: string }) => {
        onlineAgents.set(socket.id, {
          id: data.agentId,
          name: data.name,
          email: data.email,
          activeSessions: [],
        });
        socket.join('support-agents');
        
        // Send waiting sessions to the agent
        const waitingSessions = Array.from(supportSessions.entries())
          .filter(([_, session]) => session.status === 'waiting')
          .map(([id, session]) => ({ id, ...session }));
        
        socket.emit('waiting-sessions', waitingSessions);
        
        // Notify all agents about new agent online
        io.to('support-agents').emit('agent-status', {
          type: 'online',
          agent: onlineAgents.get(socket.id),
        });

        console.log(`Agent ${data.name} joined support`);
      });

      // User starts a support session
      socket.on('support:start', (data: { userId: string; userName: string; userEmail: string }) => {
        const sessionId = `session-${socket.id}`;
        
        supportSessions.set(sessionId, {
          userId: data.userId,
          userName: data.userName,
          userEmail: data.userEmail,
          startedAt: new Date(),
          status: 'waiting',
        });

        socket.join(sessionId);
        
        // Notify all agents about new support request
        io.to('support-agents').emit('new-support-request', {
          sessionId,
          ...supportSessions.get(sessionId),
        });

        socket.emit('session:created', { sessionId });
        
        console.log(`Support session ${sessionId} started for user ${data.userName}`);
      });

      // Agent accepts a support session
      socket.on('agent:accept-session', (data: { sessionId: string }) => {
        const session = supportSessions.get(data.sessionId);
        const agent = onlineAgents.get(socket.id);

        if (session && agent && session.status === 'waiting') {
          session.status = 'active';
          session.agentId = agent.id;
          session.agentName = agent.name;
          agent.activeSessions.push(data.sessionId);

          socket.join(data.sessionId);

          // Notify user that agent has joined
          io.to(data.sessionId).emit('agent:joined', {
            agentName: agent.name,
            agentId: agent.id,
          });

          // Notify all agents that session is now active
          io.to('support-agents').emit('session:status-changed', {
            sessionId: data.sessionId,
            status: 'active',
            agentName: agent.name,
          });

          console.log(`Agent ${agent.name} accepted session ${data.sessionId}`);
        }
      });

      // Send message in support session
      socket.on('message:send', (data: {
        sessionId: string;
        message: string;
        senderType: 'user' | 'agent';
        senderName: string;
      }) => {
        const messageData = {
          id: `msg-${Date.now()}-${Math.random()}`,
          sessionId: data.sessionId,
          message: data.message,
          senderType: data.senderType,
          senderName: data.senderName,
          timestamp: new Date().toISOString(),
        };

        // Broadcast message to all participants in the session
        io.to(data.sessionId).emit('message:received', messageData);

        console.log(`Message in ${data.sessionId} from ${data.senderName}: ${data.message}`);
      });

      // User is typing
      socket.on('typing:start', (data: { sessionId: string; name: string }) => {
        socket.to(data.sessionId).emit('user:typing', {
          name: data.name,
          isTyping: true,
        });
      });

      socket.on('typing:stop', (data: { sessionId: string }) => {
        socket.to(data.sessionId).emit('user:typing', {
          isTyping: false,
        });
      });

      // Close support session
      socket.on('session:close', (data: { sessionId: string }) => {
        const session = supportSessions.get(data.sessionId);
        
        if (session) {
          session.status = 'closed';
          
          // Notify all participants
          io.to(data.sessionId).emit('session:closed', {
            sessionId: data.sessionId,
            closedAt: new Date().toISOString(),
          });

          // Remove from agent's active sessions
          const agent = Array.from(onlineAgents.values()).find(
            a => a.id === session.agentId
          );
          if (agent) {
            agent.activeSessions = agent.activeSessions.filter(
              id => id !== data.sessionId
            );
          }

          console.log(`Session ${data.sessionId} closed`);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        // If agent disconnects
        const agent = onlineAgents.get(socket.id);
        if (agent) {
          // Notify about agent going offline
          io.to('support-agents').emit('agent-status', {
            type: 'offline',
            agentId: agent.id,
            agentName: agent.name,
          });

          // Close all active sessions for this agent
          agent.activeSessions.forEach(sessionId => {
            const session = supportSessions.get(sessionId);
            if (session) {
              session.status = 'waiting';
              session.agentId = undefined;
              session.agentName = undefined;

              io.to(sessionId).emit('agent:disconnected', {
                message: 'Your support agent has disconnected. You will be reassigned shortly.',
              });

              io.to('support-agents').emit('new-support-request', {
                sessionId,
                ...session,
              });
            }
          });

          onlineAgents.delete(socket.id);
        }

        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO server already initialized');
  }

  return res.socket.server.io;
};
