/**
 * Vercel serverless entry: serves the Express API + React frontend.
 * vercel.json points to this file; run "npm run build" so frontend/build exists.
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = require('./backend/server');

const frontendBuild = path.join(__dirname, 'frontend', 'build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

module.exports = app;
