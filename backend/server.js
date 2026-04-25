require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server: SocketIO } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const Message = require('./models/Message');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✓ Created uploads directory');
}

// Verify required environment variables
if (!process.env.MONGO_URI) {
  console.error('✗ ERROR: MONGO_URI is not set in .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('✗ ERROR: JWT_SECRET is not set in .env file');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for local dev + production deployment
const parseOrigins = (...originValues) => {
  return originValues
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
};

const configuredOrigins = parseOrigins(
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGINS
);

const defaultDevOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const allowedOrigins = new Set([...defaultDevOrigins, ...configuredOrigins]);

const isLoopbackOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, '');

  if (allowedOrigins.has(normalizedOrigin)) {
    return true;
  }

  // In non-production, allow localhost on any port so Vite auto-port switching still works.
  if (process.env.NODE_ENV !== 'production' && isLoopbackOrigin(normalizedOrigin)) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const connectionStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    message: isHealthy ? 'Server is running' : 'Server is running without database',
    database: connectionStates[dbState] || 'unknown',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const isCorsError = typeof err.message === 'string' && err.message.startsWith('Not allowed by CORS');
  const statusCode = isCorsError ? 403 : 500;

  res.status(statusCode).json({ message: err.message || 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new SocketIO(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
});

const onlineUsers = new Map();

const buildRoomKey = (leftUserId, rightUserId, postId) =>
  [String(leftUserId), String(rightUserId)].sort().join('-') + ':' + String(postId);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required.'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id name isBanned').lean();
    if (!user || user.isBanned) return next(new Error('Access denied.'));

    socket.userId = String(user._id);
    socket.userName = user.name;
    next();
  } catch (_error) {
    next(new Error('Invalid token.'));
  }
});

io.on('connection', (socket) => {
  const uid = socket.userId;

  if (!onlineUsers.has(uid)) onlineUsers.set(uid, new Set());
  onlineUsers.get(uid).add(socket.id);
  io.emit('presence:update', { userId: uid, online: true });

  socket.on('conversation:join', ({ otherUserId, postId }) => {
    if (!otherUserId || !postId) return;
    const roomKey = buildRoomKey(uid, otherUserId, postId);
    socket.join(roomKey);
    socket.currentRoom = roomKey;
  });

  socket.on('conversation:leave', ({ otherUserId, postId }) => {
    if (!otherUserId || !postId) return;
    const roomKey = buildRoomKey(uid, otherUserId, postId);
    socket.leave(roomKey);
  });

  socket.on('message:send', async ({ receiverId, postId, messageText }) => {
    try {
      const normalizedText = String(messageText || '').trim();
      if (!receiverId || !postId || !normalizedText) return;
      if (normalizedText.length > 2000) return;

      const message = await Message.create({
        senderId: uid,
        receiverId,
        postId,
        messageText: normalizedText,
      });

      const populated = await Message.findById(message._id)
        .populate('senderId', 'name avatar')
        .populate('receiverId', 'name avatar')
        .lean();

      const roomKey = buildRoomKey(uid, receiverId, postId);
      io.to(roomKey).emit('message:new', populated);

      const receiverSockets = onlineUsers.get(String(receiverId));
      if (receiverSockets) {
        for (const sid of receiverSockets) {
          io.to(sid).emit('notification:message', {
            fromName: socket.userName,
            postId,
            messageId: message._id,
          });
        }
      }
    } catch (err) {
      socket.emit('message:error', { message: 'Failed to send message.' });
      console.error('[socket message:send]', err.message);
    }
  });

  socket.on('typing:start', ({ otherUserId, postId }) => {
    if (!otherUserId || !postId) return;
    const roomKey = buildRoomKey(uid, otherUserId, postId);
    socket.to(roomKey).emit('typing:indicator', { userId: uid, typing: true });
  });

  socket.on('typing:stop', ({ otherUserId, postId }) => {
    if (!otherUserId || !postId) return;
    const roomKey = buildRoomKey(uid, otherUserId, postId);
    socket.to(roomKey).emit('typing:indicator', { userId: uid, typing: false });
  });

  socket.on('messages:read', async ({ otherUserId, postId }) => {
    try {
      if (!otherUserId || !postId) return;

      await Message.updateMany(
        { senderId: otherUserId, receiverId: uid, postId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );

      const roomKey = buildRoomKey(uid, otherUserId, postId);
      socket.to(roomKey).emit('messages:read-ack', { byUserId: uid, postId });
    } catch (err) {
      console.error('[socket messages:read]', err.message);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.get(uid)?.delete(socket.id);
    if (onlineUsers.get(uid)?.size === 0) {
      onlineUsers.delete(uid);
      io.emit('presence:update', { userId: uid, online: false });
    }
  });
});

const server = httpServer.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Lost & Found Hub - Backend Server`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n✅ Server Status: Running`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📚 Available Endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/profile`);
  console.log(`   GET    /api/admin/stats`);
  console.log(`   GET    /api/posts`);
  console.log(`   GET    /api/posts/:id`);
  console.log(`   POST   /api/posts`);
  console.log(`   PUT    /api/posts/:id`);
  console.log(`   DELETE /api/posts/:id`);
  console.log(`   POST   /api/messages`);
  console.log(`   GET    /api/messages/inbox`);
  console.log(`   GET    /api/messages/sent`);
  console.log(`\n✅ Health Check: /api/health`);
  console.log(`${'='.repeat(60)}\n`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`\n   Either:`);
    console.error(`   1. Kill the process using port ${PORT}`);
    console.error(`   2. Use a different port: PORT=5001 npm start\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = { io };
