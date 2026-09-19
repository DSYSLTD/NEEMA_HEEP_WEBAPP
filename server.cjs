/**
 * Hostinger Node.js Application Startup Wrapper (server.cjs)
 * 
 * Loads the pre-compiled production server from dist/server.cjs.
 * Does NOT run builds on startup to prevent boot timeouts and 503 errors.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distServer = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(distServer)) {
  // Production server already compiled
  require(distServer);
} else {
  console.warn('[Startup Notice] dist/server.cjs not found. Running automated production build...');
  try {
    // Attempt automated build
    execSync('npm run build', {
      cwd: __dirname,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    if (fs.existsSync(distServer)) {
      console.log('[Startup Success] Build completed successfully. Launching server...');
      require(distServer);
    } else {
      throw new Error('dist/server.cjs still not found after npm run build');
    }
  } catch (buildErr) {
    console.error('[Startup Build Error]', buildErr.message);
    
    // Emergency HTTP fallback listener so LiteSpeed / Passenger does not crash or show "Index of /"
    const http = require('http');
    const port = Number(process.env.PORT) || 3000;
    const server = http.createServer((req, res) => {
      res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Neema HEEP - Deployment Initialization</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>Neema HEEP Service Initializing</h2>
          <p>The production build is currently being prepared. Please trigger <code>npm run build</code> in the host terminal and reload.</p>
        </body>
        </html>
      `);
    });
    server.listen(port, '0.0.0.0', () => {
      console.log(`Emergency fallback listener active on port ${port}`);
    });
  }
}

