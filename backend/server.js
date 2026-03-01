const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authController = require('./controllers/authController');
// Explicit Google auth route first so POST /api/auth/google always works
app.post('/api/auth/google', authController.googleLogin);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/slots', require('./routes/slots'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 404 for unknown API routes (return JSON so frontend gets clear errors)
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found', path: req.path });
});

const PORT = process.env.PORT || 5000;

// Daily reminder: send email to devotees whose katha starts tomorrow
function runReminderJob() {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) return;
  const Booking = require('./models/Booking');
  const emailService = require('./utils/emailService');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  Booking.find({
    status: 'Approved',
    fromDate: { $gte: tomorrow, $lt: dayAfter },
  })
    .populate('devoteeId', 'name email')
    .then((bookings) => {
      bookings.forEach((b) => {
        if (b.devoteeId && b.devoteeId.email) {
          emailService.sendReminderToDevotee(b, b.devoteeId.email, b.devoteeId.name).catch(() => {});
        }
      });
    })
    .catch((err) => console.error('[Reminder] job error:', err.message));
}

// When run directly (e.g. node server.js), start listening and connect DB.
// When required (e.g. Vercel serverless), only export the app.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  setInterval(runReminderJob, 24 * 60 * 60 * 1000);
  setTimeout(runReminderJob, 60 * 1000);
  connectDB().then(() => {
    console.log('Backend ready: MongoDB connected.');
  }).catch(() => {});
}

module.exports = app;

