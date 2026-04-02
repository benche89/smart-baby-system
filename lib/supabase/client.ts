import { createClient as createSupabaseJsClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase env vars are missing. Falling back to localStorage mode.");
    return null;
  }

  try {
    cachedClient = createSupabaseJsClient(supabaseUrl, supabaseAnonKey);
    return cachedClient;
  } catch (error) {
    console.error("Failed to create Supabase client. Falling back to localStorage mode.", error);
    return null;
  }
}