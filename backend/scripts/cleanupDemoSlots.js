const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

const User = require('../models/User');
const AvailableSlot = require('../models/AvailableSlot');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

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

async function cleanupDemoSlots() {
  try {
    await connectDB();

    // Find old guru by email (the demo account used earlier)
    const oldGuru = await User.findOne({ email: 'guru@example.com' });
    if (!oldGuru) {
      console.log('No old guru with email guru@example.com found. Nothing to delete.');
      process.exit(0);
    }

    const result = await AvailableSlot.deleteMany({ guruId: oldGuru._id });
    console.log(`Deleted ${result.deletedCount} demo slots created under guru@example.com`);

    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up demo slots:', error.message);
    process.exit(1);
  }
}

cleanupDemoSlots();

