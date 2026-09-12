import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_NAME = 'NEEMA HEEP WEBSITE';
export const SUPABASE_PROJECT_ID = 'dmuuflbtzxoverwvzlak';
export const SUPABASE_DEFAULT_URL = 'https://dmuuflbtzxoverwvzlak.supabase.co';
export const SUPABASE_DEFAULT_ANON_KEY = 'sb_publishable_EL84MrbhdL66KKNp5jCz6A_IKop7zdD';

const env = (import.meta as any).env || {};

function sanitizeSupabaseUrl(url?: string): string {
  let cleaned = (url || '').trim();
  if (!cleaned) return SUPABASE_DEFAULT_URL;
  // Clean trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  // Strip REST endpoint if provided by mistake since @supabase/supabase-js appends /rest/v1 automatically
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  if (!cleaned.startsWith('http')) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

const rawUrl = env.VITE_SUPABASE_URL || '';
const rawKey = (env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

// Ensure the provided key is valid (reject pure project ID or empty strings)
const isKeyValid = (key: string): boolean => {
  if (!key) return false;
  if (key === 'dmuuflbtzxoverwvzlak') return false; // Mistakenly entered project id
  return key.startsWith('sb_publishable_') || key.startsWith('ey') || key.length > 25;
};

export const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
export const supabaseAnonKey = isKeyValid(rawKey) ? rawKey : SUPABASE_DEFAULT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

