require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

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

const server = app.listen(PORT, () => {
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
