/**
 * lib/supabase.ts
 * Provides a single shared Supabase client instance for the entire app.
 * Validates required public environment variables at startup so misconfiguration
 * fails fast during boot instead of surfacing as runtime query errors later.
 */

import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL. Set it in your environment (e.g. .env.local).',
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in your environment (e.g. .env.local).',
  );
}

const supabase: SupabaseClient = createSupabaseClient(
  supabaseUrl,
  supabaseAnonKey,
);

/**
 * createClient
 * Returns the shared Supabase client singleton used across the app.
 */
export function createClient(): SupabaseClient {
  return supabase;
}
