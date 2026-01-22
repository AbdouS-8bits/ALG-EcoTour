const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Store active socket connections
  const onlineAgents = new Map();

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // Agent joins as support staff
    socket.on('agent:join', async (data) => {
      console.log('👤 Agent joining:', data.name, 'Socket ID:', socket.id);
      
      onlineAgents.set(socket.id, {
        id: data.agentId,
        name: data.name,
        email: data.email,
        activeSessions: [],
      });
      socket.join('support-agents');
      
      // Get waiting sessions from database
      const waitingSessions = await prisma.supportSession.findMany({
        where: { status: 'waiting' },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });
      
      console.log('📋 Sending waiting sessions to agent:', waitingSessions.length);
      socket.emit('waiting-sessions', waitingSessions);
      
      io.to('support-agents').emit('agent-status', {
        type: 'online',
        agent: onlineAgents.get(socket.id),
      });

      console.log(`✅ Agent ${data.name} joined support - Total agents: ${onlineAgents.size}`);
    });

    // User starts a support session
    socket.on('support:start', async (data) => {
      const sessionId = `session-${socket.id}`;
      
      console.log('🆕 New support request (RAW DATA):', {
        sessionId,
        userId: data.userId,
        userIdType: typeof data.userId,
        userName: data.userName,
        userEmail: data.userEmail
      });
      
      try {
        // CRITICAL FIX: Parse userId to integer or null
        let parsedUserId = null;
        if (data.userId) {
          const numericId = parseInt(data.userId, 10);
          if (!isNaN(numericId)) {
            parsedUserId = numericId;
            console.log('✅ Parsed userId:', parsedUserId, 'Type:', typeof parsedUserId);
          } else {
            console.log('⚠️ Could not parse userId, using null');
          }
        } else {
          console.log('ℹ️ No userId provided, using null');
        }

        // Save session to database
        const session = await prisma.supportSession.create({
          data: {
            id: sessionId,
            userId: parsedUserId,  // NOW USING PARSED INTEGER
            userName: data.userName,
            userEmail: data.userEmail,
            status: 'waiting',
            startedAt: new Date(),
          },
          include: {
            messages: true
          }
        });

        socket.join(sessionId);
        
        console.log('📢 Broadcasting new support request to agents');
        io.to('support-agents').emit('new-support-request', session);

        socket.emit('session:created', { sessionId });
        
        console.log(`✅ Support session ${sessionId} created and saved to database`);
      } catch (error) {
        console.error('❌ Error creating support session:');
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        socket.emit('error', { message: 'Failed to create support session' });
      }
    });

    // Agent accepts a support session
    socket.on('agent:accept-session', async (data) => {
      console.log('🎯 Agent attempting to accept session:', {
        sessionId: data.sessionId,
        agentSocketId: socket.id
      });
      
      const agent = onlineAgents.get(socket.id);

      if (!agent) {
        console.error('❌ Agent not found in online agents:', socket.id);
        return;
      }

      try {
        // Get session from database
        const session = await prisma.supportSession.findUnique({
          where: { id: data.sessionId },
          include: {
            messages: {
              orderBy: { timestamp: 'asc' }
            }
          }
        });

        if (!session) {
          console.error('❌ Session not found in database:', data.sessionId);
          return;
        }

        if (session.status !== 'waiting') {
          console.error('❌ Session is not waiting:', session.status);
          return;
        }

        // Parse agentId to integer
        let parsedAgentId = null;
        if (agent.id) {
          const numericId = parseInt(agent.id, 10);
          if (!isNaN(numericId)) {
            parsedAgentId = numericId;
          }
        }

        // Update session in database
        const updatedSession = await prisma.supportSession.update({
          where: { id: data.sessionId },
          data: {
            status: 'active',
            agentId: parsedAgentId,
            agentName: agent.name,
          },
          include: {
            messages: {
              orderBy: { timestamp: 'asc' }
            }
          }
        });

        agent.activeSessions.push(data.sessionId);
        socket.join(data.sessionId);

        console.log('✅ Session accepted! Broadcasting to participants...');

        // Notify user that agent has joined
        io.to(data.sessionId).emit('agent:joined', {
          agentName: agent.name,
          agentId: agent.id,
        });

        // Notify all agents about status change
        const statusChangeData = {
          sessionId: data.sessionId,
          status: 'active',
          agentName: agent.name,
          session: updatedSession
        };
        
        console.log('📢 Broadcasting session status change');
        io.to('support-agents').emit('session:status-changed', statusChangeData);

        console.log(`✅ Agent ${agent.name} accepted session ${data.sessionId}`);
      } catch (error) {
        console.error('❌ Error accepting session:', error);
        socket.emit('error', { message: 'Failed to accept session' });
      }
    });

    // Send message in support session
    socket.on('message:send', async (data) => {
      try {
        // Save message to database
        const message = await prisma.supportMessage.create({
          data: {
            sessionId: data.sessionId,
            message: data.message,
            senderType: data.senderType,
            senderName: data.senderName,
            timestamp: new Date(),
          }
        });

        console.log('💬 Message sent and saved:', {
          session: data.sessionId,
          from: data.senderName,
          type: data.senderType
        });

        io.to(data.sessionId).emit('message:received', message);
      } catch (error) {
        console.error('❌ Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing:start', (data) => {
      socket.to(data.sessionId).emit('user:typing', {
        name: data.name,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(data.sessionId).emit('user:typing', {
        isTyping: false,
      });
    });

    // Close support session
    socket.on('session:close', async (data) => {
      try {
        const session = await prisma.supportSession.update({
          where: { id: data.sessionId },
          data: {
            status: 'closed',
            closedAt: new Date(),
          }
        });
        
        console.log('🔒 Closing session:', data.sessionId);
        
        io.to(data.sessionId).emit('session:closed', {
          sessionId: data.sessionId,
          closedAt: session.closedAt,
        });

        const agent = Array.from(onlineAgents.values()).find(
          a => a.id === session.agentId?.toString()
        );
        if (agent) {
          agent.activeSessions = agent.activeSessions.filter(
            id => id !== data.sessionId
          );
        }

        console.log(`✅ Session ${data.sessionId} closed`);
      } catch (error) {
        console.error('❌ Error closing session:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('👋 Client disconnecting:', socket.id);
      
      const agent = onlineAgents.get(socket.id);
      if (agent) {
        console.log('👮 Agent disconnecting:', agent.name);
        
        io.to('support-agents').emit('agent-status', {
          type: 'offline',
          agentId: agent.id,
          agentName: agent.name,
        });

        // Reassign active sessions back to waiting
        for (const sessionId of agent.activeSessions) {
          try {
            const session = await prisma.supportSession.update({
              where: { id: sessionId },
              data: {
                status: 'waiting',
                agentId: null,
                agentName: null,
              },
              include: {
                messages: true
              }
            });

            console.log('♻️ Reassigning session:', sessionId);

            io.to(sessionId).emit('agent:disconnected', {
              message: 'Your support agent has disconnected. You will be reassigned shortly.',
            });

            io.to('support-agents').emit('new-support-request', session);
          } catch (error) {
            console.error('❌ Error reassigning session:', error);
          }
        }

        onlineAgents.delete(socket.id);
        console.log(`✅ Agent removed - Remaining agents: ${onlineAgents.size}`);
      }

      console.log('✅ Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running on http://${hostname}:${port}/api/socket`);
    });
});
