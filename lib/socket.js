import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      path: '/api/socket',
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      // Join a review room
      socket.on('join-review', (reviewId) => {
        const room = `review-${reviewId}`;
        socket.join(room);
        console.log(`✅ Client ${socket.id} joined room: ${room}`);
      });

      // Leave a review room
      socket.on('leave-review', (reviewId) => {
        const room = `review-${reviewId}`;
        socket.leave(room);
        console.log(`👋 Client ${socket.id} left room: ${room}`);
      });

      // Handle new message
      socket.on('new-message', (data) => {
        const { reviewId, message } = data;
        const room = `review-${reviewId}`;
        
        // Broadcast to all clients in the review room
        io.to(room).emit('message-received', message);
        console.log(`💬 Message broadcast to room ${room}`);
      });

      // Handle review updates
      socket.on('review-updated', (data) => {
        const { tourId, review } = data;
        const room = `tour-${tourId}`;
        
        // Broadcast to all clients viewing this tour
        io.to(room).emit('review-changed', review);
        console.log(`🔄 Review update broadcast to tour ${tourId}`);
      });

      // Handle review deletion
      socket.on('review-deleted', (data) => {
        const { tourId, reviewId } = data;
        const room = `tour-${tourId}`;
        
        io.to(room).emit('review-removed', reviewId);
        console.log(`🗑️ Review deletion broadcast to tour ${tourId}`);
      });

      // Handle like/helpful updates
      socket.on('review-action', (data) => {
        const { tourId, reviewId, action, count } = data;
        const room = `tour-${tourId}`;
        
        io.to(room).emit('review-action-update', { reviewId, action, count });
        console.log(`👍 ${action} update broadcast to tour ${tourId}`);
      });

      // Join tour room to receive all updates for that tour
      socket.on('join-tour', (tourId) => {
        const room = `tour-${tourId}`;
        socket.join(room);
        console.log(`✅ Client ${socket.id} joined tour room: ${room}`);
      });

      // Leave tour room
      socket.on('leave-tour', (tourId) => {
        const room = `tour-${tourId}`;
        socket.leave(room);
        console.log(`👋 Client ${socket.id} left tour room: ${room}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });
    });
  }

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
