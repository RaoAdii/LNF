const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Error connecting to MongoDB:`);
    console.error(`  Message: ${error.message}`);
    console.error(`  Code: ${error.code}`);
    if (error.message.includes('ECONNRESET') || error.message.includes('connect ECONNREFUSED')) {
      console.error('\n⚠️  FIX REQUIRED: Update your IP whitelist in MongoDB Atlas');
      console.error('Steps:');
      console.error('1. Go to https://cloud.mongodb.com');
      console.error('2. Click "Cluster0" → Network Access');
      console.error('3. Click "Delete" on 104.28.155.52 (old IP)');
      console.error('4. Click "Add IP Address" → "Add My Current IP Address"');
      console.error('5. Click "Confirm"');
      console.error('6. Wait 1-2 minutes for changes to apply');
      console.error('7. Restart this server (npm start)\n');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
