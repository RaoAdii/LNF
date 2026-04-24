const mongoose = require('mongoose');

const MAX_ATTEMPTS = Number(process.env.DB_MAX_ATTEMPTS || 3);
const RETRY_DELAY_MS = Number(process.env.DB_RETRY_DELAY_MS || 5000);

let backgroundRetryTimer = null;
let isConnecting = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatConnectionState = (readyState) => {
  switch (readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return null;
  }

  isConnecting = true;

  try {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        console.log(`\n🔄 MongoDB Connection Attempt ${attempt}/${MAX_ATTEMPTS}...`);

        const conn = await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          retryWrites: true,
        });

        console.log('✅ MongoDB Connected Successfully!');
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Status: ${formatConnectionState(conn.connection.readyState)}\n`);

        if (backgroundRetryTimer) {
          clearInterval(backgroundRetryTimer);
          backgroundRetryTimer = null;
        }

        return conn;
      } catch (error) {
        console.error(`\n❌ MongoDB Connection Failed (Attempt ${attempt}/${MAX_ATTEMPTS})`);
        console.error(`   Error: ${error.message}\n`);

        if (attempt < MAX_ATTEMPTS) {
          console.log(`⏳ Retrying in ${Math.round(RETRY_DELAY_MS / 1000)} seconds... (${MAX_ATTEMPTS - attempt} attempts remaining)\n`);
          await wait(RETRY_DELAY_MS);
        }
      }
    }

    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Max MongoDB connection attempts reached in production. Exiting...\n');
      process.exit(1);
    }

    if (!backgroundRetryTimer) {
      const backgroundRetryDelayMs = Math.max(RETRY_DELAY_MS * 6, 30000);

      console.error('⚠️  Continuing without database in development mode.');
      console.error(`   Will retry MongoDB connection every ${Math.round(backgroundRetryDelayMs / 1000)} seconds.\n`);

      backgroundRetryTimer = setInterval(() => {
        if (mongoose.connection.readyState !== 1) {
          connectDB().catch(() => {
          });
        }
      }, backgroundRetryDelayMs);
    }

    return null;
  } finally {
    isConnecting = false;
  }
};

module.exports = connectDB;
