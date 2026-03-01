/**
 * Copy frontend/build to root ./build so Vercel serverless can find it (process.cwd()/build).
 * Run after "npm run build" in root.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'frontend', 'build');
const dst = path.join(root, 'build');

if (!fs.existsSync(src)) {
  console.warn('copy-frontend-build: frontend/build not found, skipping');
  process.exit(0);
}

function copyRecursive(s, d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.readdirSync(s).forEach((name) => {
    const srcPath = path.join(s, name);
    const dstPath = path.join(d, name);
    if (fs.statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  });
}

copyRecursive(src, dst);
console.log('Copied frontend/build to ./build for Vercel');
