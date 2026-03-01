const mongoose = require('mongoose');

// Fail fast when not connected instead of buffering for 10s
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const maxRetries = 4;
  const timeoutMs = 20000;

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in .env');
    return;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Don't force IPv4 - let Node try default (can fix some Atlas connections)
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: timeoutMs,
        connectTimeoutMS: timeoutMs,
        bufferCommands: false,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB attempt ${attempt}/${maxRetries}:`, error.message);
      if (error.message.includes('ENOTFOUND')) {
        console.error('  -> DNS failed. Try different network or Google DNS (8.8.8.8).');
      }
      if (error.message.includes('whitelist') || error.message.includes('IP') || error.message.includes('network')) {
        console.error('  -> IP may have changed, or Atlas cluster is PAUSED. In Atlas: Database -> cluster0 -> Resume (if paused).');
      }
      if (error.message.includes('auth') || error.name === 'MongoServerSelectionError') {
        console.error('  -> Check: (1) Cluster is not paused (Atlas -> Resume). (2) DB user password is correct. (3) Network Access has your current IP.');
      }
      if (attempt === maxRetries) {
        console.error('\nServer starting without DB. Fix connection then restart. Common fix: Atlas -> your cluster -> Resume.');
        return;
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
};

module.exports = connectDB;

