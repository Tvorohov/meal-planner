import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client, or null when env vars are absent (the app then runs purely
 * on localStorage). The anon key is public by design and safe to ship.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
