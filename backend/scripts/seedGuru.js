const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedGuru = async () => {
  try {
    await connectDB();

    // Check if guru already exists
    const existingGuru = await User.findOne({ email: 'guru@example.com' });
    if (existingGuru) {
      console.log('Guru account already exists!');
      console.log('Email: guru@example.com');
      console.log('Password: password123');
      process.exit(0);
    }

    // Create default guru account
    const guru = await User.create({
      name: 'Swami Ji',
      email: 'guru@example.com',
      password: 'password123',
      role: 'guru',
    });

    console.log('✅ Default Guru account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: guru@example.com');
    console.log('Password: password123');
    console.log('Role: guru');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('You can now login with these credentials');

    process.exit(0);
  } catch (error) {
    console.error('Error creating guru:', error.message);
    process.exit(1);
  }
};

seedGuru();

