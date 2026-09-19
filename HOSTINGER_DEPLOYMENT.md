# Deploying Neema HEEP to Hostinger (Node.js Application)

This guide details the exact deployment configuration to resolve the `"Index of /"` directory listing issue and ensure `neemaheep.com` serves the Node.js application.

---

## Quick Diagnostic Checklist & Solutions

### 1. Domain-to-Application Connection & Deployment Root
- **Problem**: When LiteSpeed displays `"Index of /"`, the domain is pointing to a bare folder on the filesystem without routing traffic to Node.js.
- **Solution in Hostinger hPanel**:
  1. Open **Websites** > **neemaheep.com** > **Advanced** > **Node.js**.
  2. Ensure the **Application root** points to your cloned project folder:
     `/home/uXXXXXXX/domains/neemaheep.com/public_html`
  3. Ensure the **Application URL** is set to `neemaheep.com` (and `www.neemaheep.com`).
  4. Ensure the **Application startup file** is set to `server.js`.

---

### 2. Application Entry Files
The repository includes all standard entry files expected by Hostinger, LiteSpeed, Phusion Passenger, and PM2:
- **`server.js`**: Universal root loader for Hostinger / cPanel / LiteSpeed.
- **`server.cjs`**: Self-healing boot script (automatically compiles `dist/server.cjs` if missing).
- **`dist/server.cjs`**: Pre-compiled production backend server bundle.
- **`dist/index.html`**: Production frontend Single Page Application (SPA).

---

### 3. Static vs Full-Stack Architecture
Neema HEEP is a **Full-Stack Application** (Express backend + Vite React SPA):
- **Client Bundle**: Built into `dist/` (`dist/index.html`, `dist/assets/`, favicons).
- **Backend Server**: Powered by Express in `server.ts` / `dist/server.cjs`, serving both the REST APIs (`/api/*`) and SPA routing fallbacks.
- **`.htaccess` Dual-Handling**: If the Node daemon takes time to boot, `.htaccess` includes automatic fallbacks to serve `dist/index.html` and static assets directly via LiteSpeed/Apache.

---

### 4. Server Host & Port Binding
The application server configuration in `server.ts` adheres to production cloud standards:
- **Host**: Bound to `0.0.0.0` (all network interfaces).
- **Port**: Dynamically reads `process.env.PORT` assigned by Hostinger/Passenger, defaulting to `3000`:
  ```typescript
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
  ```
- **Start Command**: `node server.js` (or `npm start`).

---

### 5. Cleaning Up Obsolete Public Files (`wp-content`, `error_log`)
To safely remove legacy WordPress files without data loss:
```bash
cd ~/domains/neemaheep.com/public_html

# Move obsolete files to a backup folder outside the public web root
mkdir -p ../legacy_backup
mv wp-content ../legacy_backup/ 2>/dev/null || true
mv error_log ../legacy_backup/ 2>/dev/null || true
```

---

### 6. Directory Listing Disabled (`Options -Indexes`)
Directory listing is disabled in `/.htaccess` via:
```apache
Options -Indexes
DirectoryIndex dist/index.html index.html index.htm
```
This ensures that LiteSpeed never generates an `"Index of /"` file listing page, even if an index file is momentarily unavailable during deployment.

---

## Step-by-Step Deployment Procedure

### Step 1: Clone / Pull Repository
```bash
cd ~/domains/neemaheep.com/public_html
git pull origin main
```

### Step 2: Install & Build
```bash
npm install
npm run build
```
Verify generated files:
```bash
ls -la dist/index.html dist/server.cjs server.js .htaccess
```

### Step 3: Configure Hostinger Node.js Manager
1. Navigate to **Hostinger hPanel** > **Node.js**.
2. Set **Node.js version**: `20.x` or `22.x`.
3. Set **Application mode**: `Production`.
4. Set **Application root**: `public_html` (or your repo folder).
5. Set **Application startup file**: `server.js`.
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `VITE_SUPABASE_URL`: `https://dmuuflbtzxoverwvzlak.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_EL84MrbhdL66KKNp5jCz6A_IKop7zdD`
7. Click **Save** and **Restart Application**.

---

## Verification Commands
```bash
# 1. Confirm HTTP 200 OK
curl -ILs https://neemaheep.com | head -n 20

# 2. Confirm "Index of /" is gone (must return empty)
curl -s https://neemaheep.com | grep -i "Index of"

# 3. Confirm API Health is responsive
curl -s https://neemaheep.com/api/health
```
