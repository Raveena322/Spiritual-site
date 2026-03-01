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

// Connect to DB (retries 3x), then start server so the site always runs
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

