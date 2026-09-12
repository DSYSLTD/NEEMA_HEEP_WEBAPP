# Deploying Neema HEEP to Hostinger via GitHub (Node.js App)

This guide walks you through deploying this full-stack application onto **Hostinger** using **GitHub** and Hostinger's **Node.js Application Manager**.

---

## 1. Prerequisites on Hostinger

1. Log in to your **Hostinger hPanel**.
2. Ensure your hosting plan supports Node.js (Hostinger Cloud Hosting, Business Web Hosting with Node.js, or VPS).
3. Navigate to **Websites** > Select your website > **Manage**.

---

## 2. Connect Your GitHub Repository

1. In hPanel, scroll to the **Advanced** section and click on **Git**.
2. Click **Create a new repository**:
   - **Repository URL**: Paste your GitHub repository URL (e.g. `https://github.com/your-org/neema-heep.git`).
   - **Branch**: `main` (or your production branch).
   - **Install path**: Leave empty or set to `public_html` (or your designated domain folder).
3. Click **Create**.
4. To enable automatic deployments on git push, copy the **Webhook URL** provided by Hostinger and add it to your GitHub repository under **Settings** > **Webhooks**.

---

## 3. Configure the Node.js Application in Hostinger

1. In hPanel, go to **Advanced** > **Node.js**.
2. Click **Create Application** (or manage your existing Node.js app):
   - **Node.js version**: Select **Node.js 20.x** (or 22.x / 18.x).
   - **Application mode**: **Production**.
   - **Application root**: Select the directory where your repo is installed (e.g. `/home/uXXXXXXX/domains/yourdomain.com/public_html`).
   - **Application URL**: Select your domain name.
   - **Application startup file**: Enter `server.js` (or `dist/server.cjs`).
3. Click **Save** or **Create**.

---

## 4. Set Environment Variables

In the **Node.js** management page under **Environment Variables**, add the following:

| Variable Name | Recommended Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `VITE_SUPABASE_URL` | `https://dmuuflbtzxoverwvzlak.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_EL84MrbhdL66KKNp5jCz6A_IKop7zdD` |
| `GEMINI_API_KEY` | *(Optional, if using Gemini features)* |

*(Note: The application already has the Supabase project configuration built-in, but setting them in your environment variables ensures you can update keys anytime without redeploying code.)*

---

## 5. Install Dependencies & Build

In Hostinger hPanel:
1. Open the **Terminal** / **SSH Console** or run commands via the Node.js panel:
   ```bash
   cd public_html
   npm install
   npm run build
   ```
2. Once the build finishes, restart your Node.js application:
   - Click **Restart Application** in the Hostinger Node.js manager.

---

## 6. Verification

1. Open your domain in the browser (e.g. `https://yourdomain.com`).
2. Test any route (e.g. `/loans`, `/programs`, `/about-us`, `/admin`).
3. Verify that the health endpoint returns OK: `https://yourdomain.com/api/health`.
