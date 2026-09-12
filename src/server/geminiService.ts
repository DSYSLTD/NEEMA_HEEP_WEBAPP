import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Configuration options for retry logic and timeouts
 */
export interface GeminiRequestOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  timeoutMs?: number;
  model?: string;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_DELAY_MS = 1000;
const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds
const DEFAULT_MODEL = "gemini-3.8-flash";

let aiClient: GoogleGenAI | null = null;

/**
 * Safely initializes the Google Gen AI client.
 * Uses process.env.GEMINI_API_KEY exclusively.
 * Uses lazy initialization to prevent server startup crashes if the key is missing.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY environment variable is not configured on the server.");
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  return aiClient;
}

/**
 * Checks if an error is transient and eligible for retry.
 * Handles HTTP 503 (Service Unavailable / Overloaded), 429 (Resource Exhausted / Rate Limit),
 * 500/502/504 gateway errors, and network connection drops.
 */
export function isTransientGeminiError(error: unknown): boolean {
  if (!error) return false;

  const err = error as Record<string, unknown>;
  const message = String(err.message || "").toLowerCase();
  const status = Number(err.status || err.statusCode || err.code || 0);

  // Status-based checks
  if (status === 503 || status === 429 || status === 500 || status === 502 || status === 504) {
    return true;
  }

  // Common message markers for 503 Overloaded or transient API drops
  const transientMarkers = [
    "503",
    "service unavailable",
    "overloaded",
    "resource_exhausted",
    "quota exceeded",
    "rate limit",
    "too many requests",
    "deadline exceeded",
    "timed out",
    "econnreset",
    "etimedout",
    "socket hang up",
    "fetch failed",
    "network error",
    "temporarily unavailable",
    "try again later",
  ];

  return transientMarkers.some((marker) => message.includes(marker));
}

/**
 * Helper to pause execution for a specified duration in milliseconds.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wraps any asynchronous Gemini API operation with:
 * 1. Timeout protection (cancels/rejects after timeoutMs, default 30s)
 * 2. Automatic Exponential Backoff retries for transient 503 / 429 errors
 * 3. Graceful error handling (cleans errors, never crashes process)
 */
export async function withGeminiRetry<T>(
  operation: (ai: GoogleGenAI) => Promise<T>,
  options: GeminiRequestOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const initialDelayMs = options.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const ai = getGeminiClient();

  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= maxRetries) {
    attempt++;

    try {
      // Execute the operation with timeout protection
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Gemini API request timed out after ${timeoutMs}ms.`));
        }, timeoutMs);

        // Ensure timer doesn't keep the event loop alive if Node exits
        if (typeof timer.unref === "function") {
          timer.unref();
        }
      });

      return await Promise.race([operation(ai), timeoutPromise]);
    } catch (err: unknown) {
      lastError = err;
      const isTransient = isTransientGeminiError(err);
      const errMsg = err instanceof Error ? err.message : String(err);

      console.warn(
        `[Gemini Service] Attempt ${attempt}/${maxRetries + 1} failed: ${errMsg}. Transient: ${isTransient}`
      );

      // If we have attempts remaining and the error is transient, wait with exponential backoff
      if (attempt <= maxRetries && isTransient) {
        // Exponential backoff: delay = initialDelay * 2^(attempt - 1) + jitter
        const backoffDelay = initialDelayMs * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * 200);
        const totalDelay = backoffDelay + jitter;

        console.info(`[Gemini Service] Retrying in ${totalDelay}ms (attempt ${attempt} of ${maxRetries})...`);
        await sleep(totalDelay);
        continue;
      }

      // Non-transient error or maximum retries exhausted
      break;
    }
  }

  // If we reach here, all retries were exhausted or the error is non-retryable
  throw lastError;
}

/**
 * Robust non-streaming text generation with retry, timeout protection, and graceful fallback.
 */
export async function generateContentWithRetry(
  prompt: string,
  systemInstruction?: string,
  options: GeminiRequestOptions = {}
): Promise<{ text: string; model: string }> {
  const modelName = options.model || DEFAULT_MODEL;

  const response = await withGeminiRetry(async (ai) => {
    return await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: systemInstruction
        ? {
            systemInstruction,
          }
        : undefined,
    });
  }, options);

  const text = (response as GenerateContentResponse).text || "";
  return { text, model: modelName };
}

/**
 * Robust streaming text generation for Server-Sent Events (SSE).
 * Keeps the connection active to prevent reverse proxy (Hostinger / Nginx) 503 gateway drops.
 */
export async function generateContentStreamWithRetry(
  prompt: string,
  systemInstruction?: string,
  options: GeminiRequestOptions = {}
) {
  const modelName = options.model || DEFAULT_MODEL;

  return await withGeminiRetry(async (ai) => {
    return await ai.models.generateContentStream({
      model: modelName,
      contents: prompt,
      config: systemInstruction
        ? {
            systemInstruction,
          }
        : undefined,
    });
  }, options);
}
