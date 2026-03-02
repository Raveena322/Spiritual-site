const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const GURU_EMAIL = 'satsangsevasumiran@gmail.com';
const GURU_PASSWORD = 'satsangsevasumiran@123';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting MongoDB:', error.message);
    process.exit(1);
  }
}

async function seedGuru() {
  try {
    await connectDB();

    let guru = await User.findOne({ email: GURU_EMAIL }).select('+password');
    if (guru) {
      // Update existing guru password & role so credentials always work
      guru.password = GURU_PASSWORD;
      guru.role = 'guru';
      await guru.save();
      console.log('Guru account already existed. Password and role updated.');
    } else {
      guru = await User.create({
        name: 'Swami Ji',
        email: GURU_EMAIL,
        password: GURU_PASSWORD,
        role: 'guru',
      });
      console.log('✅ Default Guru account created successfully!');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', GURU_EMAIL);
    console.log('Password:', GURU_PASSWORD);
    console.log('Role: guru');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('You can now login with these credentials');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding guru:', error.message);
    process.exit(1);
  }
}

seedGuru();

