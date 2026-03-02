const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

// Default guru credentials (also used by seed script)
const GURU_EMAIL = 'satsangsevasumiran@gmail.com';
const GURU_PASSWORD = 'satsangsevasumiran@123';

const dbConnected = () => mongoose.connection.readyState === 1;

// Initialize Firebase Admin (for Google sign-in verification)
if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
  admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
}

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    if (!dbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Fix: (1) Atlas: cloud.mongodb.com → Network Access → Add IP. (2) Or use local MongoDB: in backend/.env set MONGODB_URI=mongodb://localhost:27017/spiritual-katha (see FIX_DATABASE.md). Restart backend after changing.',
      });
    }
    const { name, email, password, role } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password of at least 6 characters',
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user (local provider)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'devotee',
      provider: 'local',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    const isDbError = error.message?.includes('buffering') || error.message?.includes('connection') || error.message?.includes('connect');
    res.status(isDbError ? 503 : 500).json({
      success: false,
      message: isDbError ? 'Database not connected. See FIX_DATABASE.md or set MONGODB_URI=mongodb://localhost:27017/spiritual-katha in backend/.env and restart.' : error.message,
    });
  }
};

// @desc    Start password reset (send email with link)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    if (!dbConnected()) {
      return res.status(503).json({
        success: false,
        message:
          'Database not connected. Fix: (1) Atlas: cloud.mongodb.com → Network Access → Add IP. (2) Or use local MongoDB: in backend/.env set MONGODB_URI=mongodb://localhost:27017/spiritual-katha (see FIX_DATABASE.md). Restart backend after changing.',
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Do not reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If an account exists, a password reset link has been sent.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const origin =
      (req.headers.origin && req.headers.origin.split(',')[0]) ||
      process.env.FRONTEND_URL ||
      'http://localhost:3000';
    const baseUrl = origin.replace(/\/$/, '');
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, user.name || 'User', resetUrl);

    res.status(200).json({
      success: true,
      message: 'If an account exists, a password reset link has been sent.',
    });
  } catch (error) {
    const isDbError =
      error.message?.includes('buffering') ||
      error.message?.includes('connection') ||
      error.message?.includes('connect');
    res.status(isDbError ? 503 : 500).json({
      success: false,
      message: isDbError
        ? 'Database not connected. See FIX_DATABASE.md or use local MongoDB (backend/.env).'
        : error.message,
    });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    if (!dbConnected()) {
      return res.status(503).json({
        success: false,
        message:
          'Database not connected. Fix: (1) Atlas: cloud.mongodb.com → Network Access → Add IP. (2) Or use local MongoDB: in backend/.env set MONGODB_URI=mongodb://localhost:27017/spiritual-katha (see FIX_DATABASE.md). Restart backend after changing.',
      });
    }

    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link. Please request a new one.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully. You can now log in.',
    });
  } catch (error) {
    const isDbError =
      error.message?.includes('buffering') ||
      error.message?.includes('connection') ||
      error.message?.includes('connect');
    res.status(isDbError ? 503 : 500).json({
      success: false,
      message: isDbError
        ? 'Database not connected. See FIX_DATABASE.md or use local MongoDB (backend/.env).'
        : error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    if (!dbConnected()) {
      return res.status(503).json({
        success: false,
        message:
          'Database not connected. Fix: (1) Atlas: cloud.mongodb.com → Network Access → Add IP. (2) Or use local MongoDB: in backend/.env set MONGODB_URI=mongodb://localhost:27017/spiritual-katha (see FIX_DATABASE.md). Restart backend after changing.',
      });
    }
    let { email, password } = req.body;

    // Normalize email
    email = (email || '').trim().toLowerCase();

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Special handling for default guru: always ensure account exists & password works
    if (email === GURU_EMAIL.toLowerCase() && password === GURU_PASSWORD) {
      let guru = await User.findOne({ email }).select('+password');
      if (!guru) {
        guru = await User.create({
          name: 'Swami Ji',
          email: GURU_EMAIL.toLowerCase(),
          password: GURU_PASSWORD,
          role: 'guru',
          provider: 'local',
        });
      } else {
        let changed = false;
        if (guru.role !== 'guru') {
          guru.role = 'guru';
          changed = true;
        }
        const matches = await guru.comparePassword(GURU_PASSWORD);
        if (!matches) {
          guru.password = GURU_PASSWORD;
          changed = true;
        }
        if (changed) {
          await guru.save();
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          _id: guru._id,
          name: guru.name,
          email: guru.email,
          role: guru.role,
          token: generateToken(guru._id),
        },
      });
    }

    // Normal login flow for all other users
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // User signed up with Google has no password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google sign-in. Please use "Sign in with Google" instead.',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    const isDbError =
      error.message?.includes('buffering') ||
      error.message?.includes('connection') ||
      error.message?.includes('connect');
    res.status(isDbError ? 503 : 500).json({
      success: false,
      message: isDbError
        ? 'Database not connected. See FIX_DATABASE.md or set MONGODB_URI=mongodb://localhost:27017/spiritual-katha in backend/.env and restart.'
        : error.message,
    });
  }
};

// @desc    Login or register with Google (Firebase ID token)
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    if (!dbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Fix: (1) Atlas: cloud.mongodb.com → Network Access → Add IP. (2) Or use local MongoDB: in backend/.env set MONGODB_URI=mongodb://localhost:27017/spiritual-katha (see FIX_DATABASE.md). Restart backend after changing.',
      });
    }
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required',
      });
    }

    if (!process.env.FIREBASE_PROJECT_ID || !admin.apps.length) {
      return res.status(503).json({
        success: false,
        message: 'Google sign-in is not configured',
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;
    const displayName = name || decodedToken.email?.split('@')[0] || 'User';

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: displayName,
        email,
        role: role || 'devotee',
        provider: 'google',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Google sign-in. Please try again.',
      });
    }
    const isDbError = error.message?.includes('buffering') || error.message?.includes('connection') || error.message?.includes('connect');
    res.status(isDbError ? 503 : 500).json({
      success: false,
      message: isDbError ? 'Database not connected. See FIX_DATABASE.md or use local MongoDB (backend/.env).' : (error.message || 'Google sign-in failed'),
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (!dbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. See FIX_DATABASE.md or use local MongoDB (backend/.env).',
      });
    }
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const isDbError = error.message?.includes('buffering') || error.message?.includes('connection');
    res.status(isDbError ? 503 : 500).json({
      success: false,
      message: isDbError ? 'Database not connected. See FIX_DATABASE.md or set MONGODB_URI=mongodb://localhost:27017/spiritual-katha in backend/.env and restart.' : error.message,
    });
  }
};

