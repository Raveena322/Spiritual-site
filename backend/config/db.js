const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, // Use IPv4 only - can fix DNS issues on some networks
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.message.includes('ENOTFOUND')) {
      console.error('\nDNS could not resolve MongoDB Atlas host. Try:');
      console.error('1. Use Google DNS (8.8.8.8) in your network adapter');
      console.error('2. Disable VPN or try a different network');
      console.error('3. In MongoDB Atlas: Network Access -> ensure your IP (or 0.0.0.0/0) is allowed');
    }
    process.exit(1);
  }
};

module.exports = connectDB;

