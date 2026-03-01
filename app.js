/**
 * Vercel serverless entry: serves the Express API + React frontend.
 * vercel.json points to this file; run "npm run build" so frontend/build exists.
 */
const path = require('path');
const fs = require('fs');
const express = require('express');

let app;
try {
  app = require('./backend/server');
} catch (err) {
  app = express();
  app.use(express.json());
  app.all('*', (req, res) => {
    console.error('Backend load error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server failed to start',
      error: process.env.NODE_ENV === 'production' ? undefined : err.message,
    });
  });
}

const frontendBuild = path.join(__dirname, 'frontend', 'build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// Catch unhandled errors so the function does not crash with FUNCTION_INVOCATION_FAILED
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
