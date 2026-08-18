import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Public client — used for reading courses on the user-facing pages.
 * Safe to expose (anon key). Reads are allowed by RLS policies.
 */
export const supabasePublic: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

/**
 * Admin client — used ONLY inside server actions to write courses/lessons.
 * The service-role key bypasses RLS, so admin writes work.
 */
export const supabaseAdmin: SupabaseClient | null =
  url && serviceKey ? createClient(url, serviceKey) : null;

export const isSupabaseConfigured =
  Boolean(supabasePublic) && Boolean(supabaseAdmin);
