/**
 * Hostinger Node.js Application Startup Wrapper (server.cjs)
 * 
 * Loads the pre-compiled production server from dist/server.cjs.
 * Does NOT run builds on startup to prevent boot timeouts and 503 errors.
 */

const fs = require('fs');
const path = require('path');

const distServer = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(distServer)) {
  require(distServer);
} else {
  console.error('[Startup Error] dist/server.cjs not found.');
  console.error('The application requires a build step prior to startup. Please execute: npm run build');
  process.exit(1);
}
