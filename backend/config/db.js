const mongoose = require('mongoose');

// Fail fast when not connected instead of buffering for 10s
mongoose.set('bufferCommands', false);

const LOCAL_URI = 'mongodb://localhost:27017/spiritual-katha';
const timeoutMs = 15000;

async function tryConnect(uri, label) {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: timeoutMs,
    connectTimeoutMS: timeoutMs,
    bufferCommands: false,
  }).then((conn) => {
    console.log(`MongoDB Connected: ${conn.connection.host}${label ? ` (${label})` : ''}`);
    return true;
  }).catch((err) => {
    console.error(label ? `  ${label}: ${err.message}` : err.message);
    return false;
  });
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not set in backend/.env');
    const ok = await tryConnect(LOCAL_URI, 'fallback local');
    if (ok) return;
    console.error('  -> Set MONGODB_URI in backend/.env or install MongoDB and run again.');
    return;
  }

  // Try main URI (Atlas or custom) first
  for (let attempt = 1; attempt <= 3; attempt++) {
    const ok = await tryConnect(uri);
    if (ok) return;
    if (attempt < 3) await new Promise((r) => setTimeout(r, 2000));
  }

  // If Atlas/couldn't connect and not already using localhost, try local MongoDB
  if (!uri.includes('localhost') && !uri.includes('127.0.0.1')) {
    console.log('\n  Trying local MongoDB (mongodb://localhost:27017)...');
    const ok = await tryConnect(LOCAL_URI, 'local fallback');
    if (ok) return;
  }

  console.error('\n  Fix: (1) Atlas: cloud.mongodb.com -> Network Access -> Add IP (or 0.0.0.0/0). (2) Or use local: set MONGODB_URI=mongodb://localhost:27017/spiritual-katha and run MongoDB.');
};

module.exports = connectDB;

