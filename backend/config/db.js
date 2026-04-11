const mongoose = require('mongoose');

const connectDB = async (attempt = 1) => {
  const MAX_ATTEMPTS = 3;
  
  try {
    console.log(`\n🔄 MongoDB Connection Attempt ${attempt}/${MAX_ATTEMPTS}...`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Status: ${conn.connection.readyState === 1 ? 'Connected' : 'Connecting'}\n`);
    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Failed (Attempt ${attempt}/${MAX_ATTEMPTS})`);
    console.error(`   Error: ${error.message}\n`);
    
    // Provide specific solutions based on error
    if (error.message.includes('ECONNRESET') || error.message.includes('ECONNREFUSED') || 
        error.message.includes('whitelisted') || error.message.includes('connection pooling')) {
      console.error('⚠️  ACTION REQUIRED: MongoDB Network Whitelist Issue');
      console.error('\n   Fix: Add your IP to MongoDB Atlas network whitelist');
      console.error('   Your current IP: 104.28.155.33');
      console.error('\n   Steps:');
      console.error('   1. Open: https://cloud.mongodb.com');
      console.error('   2. Go to: Cluster0 → Network Access');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Enter: 0.0.0.0/0 (for development)');
      console.error('      OR: 104.28.155.33/32 (for production)');
      console.error('   5. Click "Confirm"');
      console.error('   6. Wait 30-60 seconds for changes to apply');
      console.error('   7. Restart the server (Ctrl+C then npm start)\n');
    } else if (error.message.includes('authentication failed') || error.message.includes('401')) {
      console.error('⚠️  ACTION REQUIRED: Invalid MongoDB Credentials');
      console.error('\n   Check your .env file:');
      console.error('   - Username: aditya');
      console.error('   - Password: Should be correct in .env');
      console.error('   - Verify MONGO_URI format\n');
    }
    
    if (attempt < MAX_ATTEMPTS) {
      console.log(`⏳ Retrying in 5 seconds... (${MAX_ATTEMPTS - attempt} attempts remaining)\n`);
      return new Promise(resolve => {
        setTimeout(() => resolve(connectDB(attempt + 1)), 5000);
      });
    } else {
      console.error(`❌ Max connection attempts reached. Exiting...\n`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

module.exports = connectDB;
