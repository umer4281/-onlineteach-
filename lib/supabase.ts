import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const RESOURCE_BUCKET = "resources";

/**
 * Public client — used for reading courses on the user-facing pages.
 * Safe to expose (anon key). Reads are allowed by RLS policies.
 */
export const supabasePublic: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

/**
 * Admin client — used ONLY inside server actions to read/write and upload.
 * The service-role key bypasses RLS, so admin writes work.
 */
export const supabaseAdmin: SupabaseClient | null =
  url && serviceKey ? createClient(url, serviceKey) : null;

export const isSupabaseConfigured =
  Boolean(supabasePublic) && Boolean(supabaseAdmin);

/** Names of the Supabase environment variables that are still empty. */
export function missingSupabaseEnv(): string[] {
  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  return missing;
}

/** Public URL for a file stored in the resources bucket. */
export function resourceFileUrl(filePath: string): string {
  return `${url}/storage/v1/object/public/${RESOURCE_BUCKET}/${filePath}`;
}

