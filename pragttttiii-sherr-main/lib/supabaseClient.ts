import { createClient, SupabaseClient } from '@supabase/supabase-js';

function cleanUrl(url?: string): string {
  if (!url) return '';
  let trimmed = url.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

function cleanKey(key?: string): string {
  if (!key) return '';
  return key.trim().replace(/^['"]|['"]$/g, '');
}

const rawUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

const supabaseUrl = cleanUrl(rawUrl) || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = cleanKey(rawKey) || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  cleanUrl(rawUrl) && cleanKey(rawKey) && cleanUrl(rawUrl) !== 'https://placeholder-project.supabase.co'
);

function initSupabase(): SupabaseClient {
  try {
    const isBrowser = typeof window !== 'undefined';
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
      },
    });
  } catch (e) {
    console.warn('Supabase initialization warning:', e);
    return createClient('https://placeholder-project.supabase.co', 'dummy-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
}

export const supabase = initSupabase();
