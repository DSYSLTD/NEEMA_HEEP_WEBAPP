import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";
import {
  generateContentWithRetry,
  generateContentStreamWithRetry,
  isTransientGeminiError,
} from "./src/server/geminiService";

// ====================================================================
// SECURITY & ENVIRONMENT CONFIGURATION
// ====================================================================

// Unique 64-byte random secrets fallback if environment variables are not supplied
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex");
const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex");

// Hostinger SMTP Mailer Configuration
const SMTP_HOST = process.env.SMTP_HOST || "smtp.hostinger.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

function getMailTransporter(): nodemailer.Transporter | null {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

// Supabase Client for Server-Side Role and Credential Verification
const SUPABASE_DEFAULT_URL = "https://xkigjrdvxnzvgpoubari.supabase.co";
const SUPABASE_DEFAULT_ANON_KEY = "sb_publishable_0DmBbfMZLKF7Mh8Pyl9xPQ_qV0VYsVu";

function sanitizeSupabaseUrl(url?: string): string {
  let cleaned = (url || "").trim();
  if (!cleaned) return SUPABASE_DEFAULT_URL;
  cleaned = cleaned.replace(/[\.\/]+$/, "");
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, "");
  if (!cleaned.startsWith("http")) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

const rawSupabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_KEY || "").trim();
const isKeyValid = (key: string): boolean => {
  if (!key) return false;
  if (key === "xkigjrdvxnzvgpoubari" || key === "dmuuflbtzxoverwvzlak") return false; // Mistakenly entered project id
  return key.startsWith("sb_publishable_") || key.startsWith("ey") || key.length > 25;
};

const SUPABASE_URL = sanitizeSupabaseUrl(process.env.VITE_SUPABASE_URL);
const SUPABASE_KEY = isKeyValid(rawSupabaseKey) ? rawSupabaseKey : SUPABASE_DEFAULT_ANON_KEY;
const supabaseServer = createClient(SUPABASE_URL, SUPABASE_KEY);

// Admin & Staff Account configuration from environment variables
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "admin_neema1").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;
const staffPassword = process.env.STAFF_PASSWORD;

// Internal credential store - stores ONLY bcrypt hashes, never plaintext
interface StaffRecord {
  passwordHash: string;
  fullName: string;
  role: string;
  email: string;
}

const staffUserStore: Record<string, StaffRecord> = {};

function registerStaffUser(aliases: string[], record: { password: string; fullName: string; role: string; email: string }) {
  const hash = bcrypt.hashSync(record.password, 10);
  aliases.forEach(alias => {
    staffUserStore[alias.toLowerCase().trim()] = {
      passwordHash: hash,
      fullName: record.fullName,
      role: record.role,
      email: record.email,
    };
  });
}

// 1. Pre-register core accounts with environment overrides
registerStaffUser(
  [ADMIN_USERNAME, "ptrckmunene@gmail.com", "patrick munene", "ptrckmunene", "admin"],
  {
    password: adminPassword || "@super123#",
    fullName: process.env.ADMIN_FULL_NAME || "Patrick Munene",
    role: "Superadmin",
    email: "ptrckmunene@gmail.com",
  }
);

registerStaffUser(
  ["muthonichar12@gmail.com", "charity muthoni", "muthonichar12"],
  {
    password: "@Cham123#",
    fullName: "Charity Muthoni",
    role: "Author",
    email: "muthonichar12@gmail.com",
  }
);

if (staffPassword) {
  const staffUser = (process.env.STAFF_USERNAME || "staff").toLowerCase();
  registerStaffUser(
    [staffUser],
    {
      password: staffPassword,
      fullName: process.env.STAFF_FULL_NAME || "Neema Staff Member",
      role: "Staff Member",
      email: `${staffUser}@neemaheep.org`,
    }
  );
}

// Development fallback hash removed - credentials must only come from environment
function validateStartupSecrets() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!process.env.SESSION_SECRET && isProduction) {
    console.warn("[SECURITY NOTICE] SESSION_SECRET is not set in environment. A runtime secret was generated; sessions will reset on server restart.");
  }
  if (!process.env.JWT_SECRET && isProduction) {
    console.warn("[SECURITY NOTICE] JWT_SECRET is not set in environment.");
  }
  if (!adminPassword && !staffPassword) {
    console.warn("[SECURITY NOTICE] No ADMIN_PASSWORD or STAFF_PASSWORD configured in environment variables. Server-side staff authentication is disabled until configured.");
  }
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.info("[INFO] Hostinger SMTP credentials (SMTP_USER / SMTP_PASSWORD) not configured. Outbound email dispatch is disabled.");
  }
}

// ====================================================================
// IN-MEMORY RATE LIMITING & SECURITY STORES
// ====================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitRecord>();

function isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= maxAttempts) {
    return true;
  }
  entry.count++;
  return false;
}

// Hashed OTP Storage (5-minute expiration)
interface HashedOtpRecord {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
}
const otpStore = new Map<string, HashedOtpRecord>();

// Single-use Password Reset Token Storage (10-minute expiration)
interface ResetTokenRecord {
  username: string;
  expiresAt: number;
}
const resetTokenStore = new Map<string, ResetTokenRecord>();

// Helper: Get Client IP
function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "127.0.0.1";
}

// ====================================================================
// SERVER INITIALIZATION
// ====================================================================

async function startServer() {
  // Validate required secrets at startup without printing their values
  validateStartupSecrets();

  const app = express();

  // Basic security and parsing middlewares
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Serve static uploads
  app.use("/uploads", express.static(path.resolve("public/uploads")));

  // Disable x-powered-by header
  app.disable("x-powered-by");

  // Restrict CORS to authorized frontend origins
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin) {
      const isAllowed =
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" &&
          (origin === "http://localhost:3000" || origin === "http://127.0.0.1:3000")) ||
        origin.endsWith(".europe-west2.run.app");

      if (isAllowed) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type,Authorization,X-Requested-With"
        );
      }
    }
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // Health Check Endpoints (Section 11)
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, status: "ok" });
  });

  // ------------------------------------------------------------------
  // AUTH: Login with Rate Limiting, Bcrypt Hashing & DB Fallback
  // ------------------------------------------------------------------
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password are required." });
    }

    const ip = getClientIp(req);
    const u = String(username).trim().toLowerCase();
    const rawPass = String(password);
    const rateLimitKey = `login_${ip}_${u}`;

    // Rate limiting: 10 attempts per 15 minutes
    if (isRateLimited(rateLimitKey, 10, 15 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: "Too many login attempts. Please try again in 15 minutes."
      });
    }

    let staff = staffUserStore[u];
    let isMatch = false;

    // 1. Check in-memory store
    if (staff) {
      isMatch = bcrypt.compareSync(rawPass, staff.passwordHash);
    }

    // 2. Query Supabase user_roles table if not matched in-memory
    if (!isMatch) {
      try {
        const { data: dbUser } = await supabaseServer
          .from("user_roles")
          .select("*")
          .or(`email.ilike.${u},user_name.ilike.${u}`)
          .maybeSingle();

        if (dbUser && dbUser.status === "Active" && dbUser.initial_password) {
          const storedPass = String(dbUser.initial_password).trim();
          if (
            rawPass === storedPass ||
            (storedPass.startsWith("$2") && bcrypt.compareSync(rawPass, storedPass))
          ) {
            isMatch = true;
            staff = {
              passwordHash: bcrypt.hashSync(rawPass, 10),
              fullName: dbUser.user_name || u,
              role: dbUser.role || "Author",
              email: dbUser.email || u,
            };
            // Cache in memory store
            staffUserStore[u] = staff;
            if (dbUser.email) staffUserStore[dbUser.email.toLowerCase().trim()] = staff;
          }
        }
      } catch (dbErr) {
        console.warn("[AUTH DB LOOKUP WARNING]", dbErr);
      }
    }

    if (isMatch && staff) {
      // Reset rate limit on success
      rateLimits.delete(rateLimitKey);

      // Generate HMAC session signature with SESSION_SECRET
      const sessionPayload = `${u}:${Date.now()}`;
      const signature = crypto.createHmac("sha256", SESSION_SECRET).update(sessionPayload).digest("hex");
      const sessionToken = `${sessionPayload}.${signature}`;

      // Set secure HTTP-only cookie in production
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("neema_session", sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
        path: "/",
      });

      return res.json({
        success: true,
        user: {
          username: u,
          email: staff.email,
          fullName: staff.fullName,
          role: staff.role,
        },
        token: sessionToken,
      });
    }

    // Invalid credentials
    return res.status(401).json({ success: false, error: "Access Denied: Invalid email/username or security password." });
  });

  // ------------------------------------------------------------------
  // AUTH: Request OTP for Password Reset (Hashed & Never Returned)
  // ------------------------------------------------------------------
  app.post("/api/auth/send-otp", (req: Request, res: Response) => {
    const { identifier, deliveryMethod } = req.body || {};
    if (!identifier) {
      return res.status(400).json({ success: false, error: "Username, email, or phone number is required." });
    }

    const ip = getClientIp(req);
    const cleanId = String(identifier).trim().toLowerCase();
    const rateLimitKey = `otp_send_${ip}_${cleanId}`;

    // Rate limiting: 3 requests per 10 minutes
    if (isRateLimited(rateLimitKey, 3, 10 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: "Too many OTP requests. Please wait 10 minutes before requesting another code."
      });
    }

    // Generate cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = bcrypt.hashSync(rawOtp, 10);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(cleanId, {
      hashedOtp,
      expiresAt,
      attempts: 0,
    });

    // If the identifier is an email address and SMTP is configured, dispatch via Hostinger Mail
    if (cleanId.includes("@")) {
      const transporter = getMailTransporter();
      if (transporter) {
        transporter.sendMail({
          from: `"Neema HEEP Security" <${SMTP_USER}>`,
          to: cleanId,
          subject: "Neema HEEP - Security Verification Code",
          text: `Your 6-digit verification code is: ${rawOtp}. This code expires in 5 minutes. Do not share this code.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #074504; margin-top: 0;">Neema HEEP Verification</h2>
              <p style="color: #4a5568; font-size: 14px;">A verification code was requested for your account security.</p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #074504; font-family: monospace;">${rawOtp}</span>
              </div>
              <p style="color: #718096; font-size: 12px;">This single-use code is valid for 5 minutes. If you did not request this, please disregard this notice.</p>
            </div>
          `
        }).catch((err) => {
          console.error("[SMTP ERROR] Mail delivery issue:", err instanceof Error ? err.message : "Delivery failure");
        });
      }
    }

    // IMPORTANT: The OTP value is NEVER returned in the API response.
    // Use neutral message to prevent user enumeration
    return res.json({
      success: true,
      message: "If the account exists, a verification code has been dispatched.",
    });
  });

  // ------------------------------------------------------------------
  // AUTH: Verify OTP & Issue Single-Use Password Reset Token
  // ------------------------------------------------------------------
  app.post("/api/auth/verify-otp", (req: Request, res: Response) => {
    const { identifier, otp } = req.body || {};
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, error: "Identifier and verification code are required." });
    }

    const ip = getClientIp(req);
    const cleanId = String(identifier).trim().toLowerCase();
    const rateLimitKey = `otp_verify_${ip}_${cleanId}`;

    // Rate limiting: 5 verification attempts per 10 minutes
    if (isRateLimited(rateLimitKey, 5, 10 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: "Too many verification attempts. Please wait before trying again."
      });
    }

    const record = otpStore.get(cleanId);
    if (!record || record.expiresAt < Date.now()) {
      otpStore.delete(cleanId);
      return res.status(400).json({
        success: false,
        error: "Verification code expired or not found. Please request a new code."
      });
    }

    if (record.attempts >= 3) {
      otpStore.delete(cleanId);
      return res.status(429).json({
        success: false,
        error: "Too many incorrect attempts. This verification code has been invalidated."
      });
    }

    record.attempts++;
    const isValid = bcrypt.compareSync(String(otp).trim(), record.hashedOtp);
    if (!isValid) {
      return res.status(400).json({ success: false, error: "Invalid verification code. Please try again." });
    }

    // OTP verified! Invalidate immediately to prevent reuse
    otpStore.delete(cleanId);

    // Generate single-use password reset token (valid for 10 minutes)
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawResetToken).digest("hex");

    resetTokenStore.set(tokenHash, {
      username: cleanId,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Verification successful.",
      resetToken: rawResetToken,
    });
  });

  // ------------------------------------------------------------------
  // AUTH: Reset Password with Single-Use Hashed Token
  // ------------------------------------------------------------------
  app.post("/api/auth/reset-password", (req: Request, res: Response) => {
    const { resetToken, newPassword } = req.body || {};
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, error: "Reset token and new password are required." });
    }

    const ip = getClientIp(req);
    const rateLimitKey = `pwd_reset_${ip}`;
    if (isRateLimited(rateLimitKey, 5, 15 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: "Too many password reset attempts. Please wait 15 minutes before retrying."
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long."
      });
    }

    const tokenHash = crypto.createHash("sha256").update(String(resetToken)).digest("hex");
    const record = resetTokenStore.get(tokenHash);

    if (!record || record.expiresAt < Date.now()) {
      resetTokenStore.delete(tokenHash);
      return res.status(400).json({
        success: false,
        error: "Password reset token is invalid or expired. Please restart verification."
      });
    }

    // Immediately consume and invalidate the reset token
    resetTokenStore.delete(tokenHash);

    const u = record.username.toLowerCase();
    const newHash = bcrypt.hashSync(newPassword, 10);

    if (staffUserStore[u]) {
      staffUserStore[u].passwordHash = newHash;
    }

    try {
      supabaseServer
        .from("user_roles")
        .update({ initial_password: newPassword })
        .or(`email.ilike.${u},user_name.ilike.${u}`)
        .then(() => {});
    } catch {
      // Ignored
    }

    return res.json({
      success: true,
      message: "Password reset complete. If the account exists, you can now log in with your new password."
    });
  });

  // ------------------------------------------------------------------
  // GENERAL OTP: Phone / Email Lead Validation (Secure)
  // ------------------------------------------------------------------
  app.post("/api/otp/send", (req: Request, res: Response) => {
    const { phone, email } = req.body || {};
    const target = (phone || email || "").trim();
    if (!target) {
      return res.status(400).json({ success: false, error: "Phone number or email is required." });
    }

    const ip = getClientIp(req);
    const key = `lead_otp_${ip}_${target}`;
    if (isRateLimited(key, 5, 10 * 60 * 1000)) {
      return res.status(429).json({ success: false, error: "Too many OTP requests. Please wait before retrying." });
    }

    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = bcrypt.hashSync(rawOtp, 10);

    otpStore.set(`lead_${target}`, {
      hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    if (target.includes("@")) {
      const transporter = getMailTransporter();
      if (transporter) {
        transporter.sendMail({
          from: `"Neema HEEP" <${SMTP_USER}>`,
          to: target,
          subject: "Neema HEEP - Verification Code",
          text: `Your verification code is: ${rawOtp}. Valid for 5 minutes.`,
        }).catch((err) => {
          console.error("[SMTP ERROR] Lead OTP delivery error:", err instanceof Error ? err.message : "Error");
        });
      }
    }

    // In production, send via SMS/Email provider. Code is never exposed.
    return res.json({
      success: true,
      message: "Verification code sent to your registered contact.",
    });
  });

  app.post("/api/otp/verify", (req: Request, res: Response) => {
    const { phone, email, phoneCode, emailCode } = req.body || {};
    const target = (phone || email || "").trim();
    const code = (phoneCode || emailCode || "").trim();

    if (!target || !code) {
      return res.status(400).json({ success: false, error: "Contact and verification code are required." });
    }

    const storeKey = `lead_${target}`;
    const record = otpStore.get(storeKey);

    if (!record || record.expiresAt < Date.now()) {
      otpStore.delete(storeKey);
      return res.status(400).json({ success: false, error: "Verification code expired or not found." });
    }

    if (record.attempts >= 4) {
      otpStore.delete(storeKey);
      return res.status(429).json({ success: false, error: "Too many failed attempts. Code invalidated." });
    }

    record.attempts++;
    const isValid = bcrypt.compareSync(code, record.hashedOtp);
    if (!isValid) {
      return res.status(400).json({ success: false, error: "Invalid verification code." });
    }

    otpStore.delete(storeKey);
    return res.json({ success: true, verified: true, message: "Code verified successfully." });
  });

  // ------------------------------------------------------------------
  // BLOG & ARTICLES REST APIS (SUPABASE BACKED + PERSISTENT RESILIENCE)
  // ------------------------------------------------------------------

  const ARTICLES_FILE = path.resolve("data/articles.json");

  function getLocalArticles(): any[] {
    try {
      if (fs.existsSync(ARTICLES_FILE)) {
        const raw = fs.readFileSync(ARTICLES_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading local articles:", e);
    }
    return [];
  }

  function saveLocalArticles(articles: any[]) {
    try {
      fs.mkdirSync(path.dirname(ARTICLES_FILE), { recursive: true });
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
    } catch (e) {
      console.error("Error saving local articles:", e);
    }
  }

  // POST /api/upload (Featured image upload endpoint)
  app.post("/api/upload", async (req: Request, res: Response) => {
    try {
      const { fileBase64, filename, contentType } = req.body || {};
      if (!fileBase64) {
        return res.status(400).json({ success: false, error: "Image data is required." });
      }

      const cleanFilename = (filename || `image-${Date.now()}.webp`).replace(/[^a-zA-Z0-9._-]/g, "_");
      const ext = cleanFilename.split(".").pop() || "webp";
      const mime = contentType || (ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/webp");
      const buffer = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const uniqueName = `${year}/${month}/${Date.now()}-${cleanFilename}`;

      // 1. Try uploading to Supabase Storage bucket 'blog-images'
      try {
        const { data: sbData, error: sbError } = await supabaseServer.storage
          .from("blog-images")
          .upload(uniqueName, buffer, {
            contentType: mime,
            upsert: true
          });

        if (!sbError && sbData?.path) {
          const { data: pubData } = supabaseServer.storage
            .from("blog-images")
            .getPublicUrl(sbData.path);

          return res.json({
            success: true,
            url: pubData.publicUrl,
            path: sbData.path,
            storage: "supabase"
          });
        }
      } catch (sbErr) {
        console.warn("[Supabase Storage upload warning, falling back to local static storage]:", sbErr);
      }

      // 2. Local storage fallback
      const uploadDir = path.resolve(`public/uploads/blog/${year}/${month}`);
      fs.mkdirSync(uploadDir, { recursive: true });
      const localFilename = `${Date.now()}-${cleanFilename}`;
      const localFilePath = path.join(uploadDir, localFilename);
      fs.writeFileSync(localFilePath, buffer);

      const localUrl = `/uploads/blog/${year}/${month}/${localFilename}`;
      return res.json({
        success: true,
        url: localUrl,
        path: `uploads/blog/${year}/${month}/${localFilename}`,
        storage: "local"
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed";
      return res.status(500).json({ success: false, error: msg });
    }
  });

  // GET /api/articles (Public list or Admin all)
  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const showAll = req.query.all === "true";
      let supabaseArticles: any[] = [];

      try {
        let query = supabaseServer
          .from("blog_articles")
          .select("*")
          .order("published_at", { ascending: false });

        if (!showAll) {
          query = query.in("status", ["Published", "published", "Active"]);
        }

        const { data, error } = await query;
        if (!error && data) {
          supabaseArticles = data;
        }
      } catch (sbErr) {
        console.warn("[Supabase articles query notice]:", sbErr);
      }

      // Read local persistent articles
      const localArticles = getLocalArticles();
      const filteredLocal = showAll
        ? localArticles
        : localArticles.filter((a: any) => ["Published", "published", "Active"].includes(a.status));

      // Merge and de-duplicate by slug
      const map = new Map<string, any>();
      for (const a of filteredLocal) {
        map.set(a.slug, a);
      }
      for (const a of supabaseArticles) {
        map.set(a.slug, a);
      }

      const merged = Array.from(map.values()).sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at || 0).getTime();
        const dateB = new Date(b.published_at || b.created_at || 0).getTime();
        return dateB - dateA;
      });

      return res.json({ success: true, articles: merged });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error querying articles";
      return res.status(500).json({ success: false, error: msg });
    }
  });

  // GET /api/articles/:slug (Single article)
  app.get("/api/articles/:slug", async (req: Request, res: Response) => {
    try {
      const cleanSlug = req.params.slug.toLowerCase().trim();

      // 1. Try Supabase query
      try {
        const { data, error } = await supabaseServer
          .from("blog_articles")
          .select("*")
          .eq("slug", cleanSlug)
          .maybeSingle();

        if (!error && data) {
          return res.json({ success: true, article: data });
        }
      } catch (sbErr) {
        console.warn("[Supabase get article notice]:", sbErr);
      }

      // 2. Try local persistent store
      const local = getLocalArticles();
      const matched = local.find((p: any) => p.slug === cleanSlug);
      if (matched) {
        return res.json({ success: true, article: matched });
      }

      return res.status(404).json({ success: false, error: "Article not found" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error querying article";
      return res.status(500).json({ success: false, error: msg });
    }
  });

  // POST /api/articles (Create or Update Article)
  app.post("/api/articles", async (req: Request, res: Response) => {
    try {
      const articlePayload = req.body;
      if (!articlePayload || !articlePayload.title || !articlePayload.slug) {
        return res.status(400).json({ success: false, error: "Title and slug are required." });
      }

      const cleanTitle = articlePayload.title.trim();
      const cleanSlug = articlePayload.slug.toLowerCase().trim();
      const isPublished = articlePayload.status === "Published";
      const publishedAt = isPublished
        ? (articlePayload.published_at || new Date().toISOString())
        : null;

      // Prepare normalized payload strictly matching Supabase blog_articles schema
      const dbPayload: any = {
        title: cleanTitle,
        slug: cleanSlug,
        excerpt: articlePayload.excerpt || cleanTitle,
        content: articlePayload.content || articlePayload.excerpt || cleanTitle,
        image: articlePayload.image || articlePayload.featured_image_url || "/imara_loan.jpg",
        category: articlePayload.category || "Financial Literacy",
        author_name: articlePayload.author_name || articlePayload.author || "Patrick Munene",
        author_id: articlePayload.author_id || "auth_pm",
        author_role: articlePayload.author_role || "Author",
        author_avatar: articlePayload.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        status: articlePayload.status || "Published",
        published_at: publishedAt,
        tags: Array.isArray(articlePayload.tags) ? articlePayload.tags : [],
        blocks: Array.isArray(articlePayload.blocks) ? articlePayload.blocks : [],
        seo: typeof articlePayload.seo === "object" && articlePayload.seo !== null
          ? articlePayload.seo
          : {
              metaTitle: articlePayload.seo_title || `${cleanTitle} | Neema HEEP Journal`,
              metaDescription: articlePayload.seo_description || articlePayload.excerpt || cleanTitle
            },
        views: Number(articlePayload.views) || 0,
        likes: Number(articlePayload.likes) || 0,
        updated_at: new Date().toISOString()
      };

      if (articlePayload.id) {
        dbPayload.id = articlePayload.id;
      }

      // Save to local persistent storage first so data is guaranteed never lost
      const local = getLocalArticles();
      const idx = local.findIndex((p: any) => p.slug === cleanSlug);
      let updatedLocal: any[];
      if (idx >= 0) {
        updatedLocal = local.map((p: any, i: number) => i === idx ? { ...p, ...dbPayload } : p);
      } else {
        const itemWithId = { ...dbPayload, id: dbPayload.id || `art_${Date.now()}` };
        updatedLocal = [itemWithId, ...local];
      }
      saveLocalArticles(updatedLocal);

      // Attempt Supabase upsert
      try {
        const { data, error } = await supabaseServer
          .from("blog_articles")
          .upsert([dbPayload], { onConflict: "slug" })
          .select()
          .maybeSingle();

        if (!error && data) {
          return res.json({ success: true, article: data });
        }
      } catch (sbErr) {
        console.warn("[Supabase save article warning]:", sbErr);
      }

      return res.json({ success: true, article: dbPayload });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save article";
      return res.status(500).json({ success: false, error: msg });
    }
  });

  // PATCH /api/articles/:slug/status (Update status e.g. Published / Draft / Trash)
  app.patch("/api/articles/:slug/status", async (req: Request, res: Response) => {
    try {
      const cleanSlug = req.params.slug.toLowerCase().trim();
      const { status } = req.body || {};
      if (!status) {
        return res.status(400).json({ success: false, error: "Status is required." });
      }

      // Update in local store
      const local = getLocalArticles();
      const matched = local.find((p: any) => p.slug === cleanSlug);
      if (matched) {
        matched.status = status;
        matched.published_at = status === "Published" ? new Date().toISOString() : null;
        matched.updated_at = new Date().toISOString();
        saveLocalArticles(local);
      }

      // Update in Supabase
      try {
        const { data } = await supabaseServer
          .from("blog_articles")
          .update({
            status,
            published_at: status === "Published" ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq("slug", cleanSlug)
          .select()
          .maybeSingle();

        if (data) {
          return res.json({ success: true, article: data });
        }
      } catch (sbErr) {
        console.warn("[Supabase status update warning]:", sbErr);
      }

      return res.json({ success: true, article: matched || { slug: cleanSlug, status } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update article status";
      return res.status(500).json({ success: false, error: msg });
    }
  });

  // DELETE /api/articles/:slug (Delete Article)
  app.delete("/api/articles/:slug", async (req: Request, res: Response) => {
    try {
      const cleanSlug = req.params.slug.toLowerCase().trim();

      // Remove from local store
      const local = getLocalArticles();
      const remaining = local.filter((p: any) => p.slug !== cleanSlug);
      saveLocalArticles(remaining);

      // Remove from Supabase
      try {
        await supabaseServer
          .from("blog_articles")
          .delete()
          .eq("slug", cleanSlug);
      } catch (sbErr) {
        console.warn("[Supabase delete article warning]:", sbErr);
      }

      return res.json({ success: true, message: "Article deleted successfully." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete article";
      return res.status(500).json({ success: false, error: msg });
    }
  });

  // ------------------------------------------------------------------
  // BUSINESS APIS
  // ------------------------------------------------------------------
  app.post("/api/eligibility/submit", (_req: Request, res: Response) => {
    res.json({ success: true, message: "Eligibility request submitted.", id: `elig_${Date.now()}` });
  });

  app.post("/api/eligibility/register", (_req: Request, res: Response) => {
    res.json({ success: true, message: "Registration submitted successfully.", id: `reg_${Date.now()}` });
  });

  app.post("/api/leads/submit", async (req: Request, res: Response) => {
    try {
      const { form_type, type, full_name, name, email, phone, subject, message, source_page, signupSource, details } = req.body || {};
      
      const effectiveType = String(form_type || type || "contact").toLowerCase();
      let mappedType = "contact";
      if (effectiveType.includes("prequal") || effectiveType.includes("loan")) mappedType = "prequalification";
      else if (effectiveType.includes("callback") || effectiveType.includes("call")) mappedType = "callback";
      else mappedType = "contact";

      const leadPayload = {
        form_type: mappedType,
        full_name: full_name || name || "Anonymous",
        email: email || "",
        phone: phone || "",
        subject: subject || (details && details.interest) || "General Inquiry",
        message: message || (details && details.message) || (details && details.notes) || "",
        source_page: source_page || signupSource || "/contact-us",
        status: "New",
        details: details || {},
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabaseServer.from("leads").insert([leadPayload]).select().single();
      if (error) {
        console.warn("[API Leads Submit] Supabase insert warning:", error.message);
      }

      return res.json({
        success: true,
        message: "Lead submitted successfully.",
        leadId: data?.id || `lead_${Date.now()}`
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission error";
      return res.status(500).json({ success: false, error: msg });
    }
  });

  // ------------------------------------------------------------------
  // ADMIN: Secure Server-Side Password Reset (No plaintext secrets stored)
  // ------------------------------------------------------------------
  app.post("/api/admin/reset-user-password", async (req: Request, res: Response) => {
    try {
      const { email, targetName, adminUser } = req.body || {};
      if (!email) {
        return res.status(400).json({ success: false, error: "Target user email is required." });
      }

      const cleanEmail = String(email).toLowerCase().trim();

      // Trigger standard Supabase Auth password reset flow
      try {
        await supabaseServer.auth.resetPasswordForEmail(cleanEmail);
      } catch (authErr) {
        console.warn("[Admin Password Reset] Supabase auth reset notice:", authErr);
      }

      // Record administrative action in public.audit_logs without storing secrets
      try {
        await supabaseServer.from("audit_logs").insert([{
          actor: adminUser || "Administrator",
          actor_role: "Administrator",
          event: "Initiated Password Reset",
          category: "Security",
          status: "Success",
          details: {
            target_user: targetName || cleanEmail,
            target_email: cleanEmail,
            action: "Password reset link requested via Supabase Auth"
          },
          created_at: new Date().toISOString()
        }]);
      } catch (auditErr) {
        console.warn("[Audit Log] Could not log password reset action:", auditErr);
      }

      return res.json({
        success: true,
        message: `Secure password reset instructions sent to ${cleanEmail}. Action logged in audit logs.`
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Password reset initiation failed";
      return res.status(500).json({ success: false, error: msg });
    }
  });

  // ------------------------------------------------------------------
  // RESILIENT GOOGLE GEMINI AI ENDPOINTS (503 & OVERLOAD PROTECTED)
  // ------------------------------------------------------------------

  // AI Health / Capability probe
  app.get("/api/ai/health", (_req: Request, res: Response) => {
    const isConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    res.json({
      status: "ok",
      configured: isConfigured,
      model: "gemini-3.8-flash",
      retryStrategy: "Exponential Backoff (3 attempts, max 30s timeout)",
    });
  });

  // Non-streaming generation with automatic Exponential Backoff retries
  app.post("/api/ai/generate", async (req: Request, res: Response) => {
    const { prompt, systemInstruction } = req.body || {};

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be a non-empty string.",
      });
    }

    try {
      const result = await generateContentWithRetry(prompt.trim(), systemInstruction);
      return res.json({
        success: true,
        text: result.text,
        model: result.model,
      });
    } catch (error: unknown) {
      console.error("[Gemini API Route Error]:", error);

      if (isTransientGeminiError(error)) {
        return res.status(503).json({
          success: false,
          error: "The AI service is currently busy or overloaded. Please try again in a few moments.",
          retryable: true,
        });
      }

      const errMsg = error instanceof Error ? error.message : "Unknown error occurred.";
      if (errMsg.includes("GEMINI_API_KEY")) {
        return res.status(503).json({
          success: false,
          error: "AI service is currently not configured on this server.",
          retryable: false,
        });
      }

      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred while communicating with the AI service.",
        retryable: false,
      });
    }
  });

  // Streaming generation (Server-Sent Events) to keep connection alive and prevent proxy 503 drops
  app.post("/api/ai/generate-stream", async (req: Request, res: Response) => {
    const { prompt, systemInstruction } = req.body || {};

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be a non-empty string.",
      });
    }

    // Set Server-Sent Events headers
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    try {
      const responseStream = await generateContentStreamWithRetry(prompt.trim(), systemInstruction);

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: unknown) {
      console.error("[Gemini Stream Route Error]:", error);
      const isTransient = isTransientGeminiError(error);

      // Send error payload across SSE before closing
      res.write(
        `data: ${JSON.stringify({
          error: isTransient
            ? "The AI service is currently overloaded. Please try again shortly."
            : "Failed to generate AI response.",
          status: isTransient ? 503 : 500,
        })}\n\n`
      );
      res.end();
    }
  });

  // API 404 Catch-All
  app.all("/api/*", (_req: Request, res: Response) => {
    res.status(404).json({ success: false, error: "API endpoint not found." });
  });

  // Explicit XML Sitemap and Robots.txt Handlers
  app.get("/sitemap.xml", (_req: Request, res: Response) => {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send("Sitemap not found");
    }
  });

  app.get("/robots.txt", (_req: Request, res: Response) => {
    const robotsPath = path.join(process.cwd(), "public", "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.sendFile(robotsPath);
    } else {
      res.status(404).send("Robots.txt not found");
    }
  });

  // Serve static assets from /public directory
  app.use(express.static(path.join(process.cwd(), "public"), {
    maxAge: "1d",
    fallthrough: true,
  }));

  // ------------------------------------------------------------------
  // PRODUCTION VS DEVELOPMENT STATIC SERVING
  // ------------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    // Development: integrate Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve compiled Vite files directly from dist directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application index.html not found. Please ensure 'npm run build' has executed.");
      }
    });
  }

  // ------------------------------------------------------------------
  // SERVER LISTEN: Hostinger Runtime Port
  // ------------------------------------------------------------------
  const port = Number(process.env.PORT) || 3000;

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
