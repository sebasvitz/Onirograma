import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — only created on first use so build-time static analysis
// doesn't fail when env vars are not set in the build environment.
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
      );
    }
    _client = createClient(url, key);
  }
  return _client;
}

// Convenience export — server-side only (API routes / Server Components)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
