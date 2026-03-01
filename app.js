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

// Resolve frontend build dir (Vercel: process.cwd()/build after copy step; else frontend/build)
const possibleRoots = [
  process.cwd(),
  __dirname,
  path.join(__dirname, '..'),
  path.join(process.cwd(), '..'),
  path.join(__dirname, '..', '..'),
];
let frontendBuild = null;
const pathsToTry = ['build', 'frontend/build'];
for (const root of possibleRoots) {
  for (const sub of pathsToTry) {
    const candidate = path.join(root, ...sub.split('/'));
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, 'index.html'))) {
      frontendBuild = candidate;
      break;
    }
  }
  if (frontendBuild) break;
}

if (frontendBuild) {
  app.use(express.static(frontendBuild));
}

// SPA fallback: serve index.html for any non-API GET (so / and /login etc work)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (frontendBuild) {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  } else {
    res.status(404).send('Frontend not found. Ensure Build Command is "npm run build" and frontend builds successfully.');
  }
});

// Catch unhandled errors so the function does not crash with FUNCTION_INVOCATION_FAILED
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
