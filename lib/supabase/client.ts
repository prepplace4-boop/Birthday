import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type TypedSupabaseClient = ReturnType<typeof createBrowserClient> | undefined;

export function createClient(): TypedSupabaseClient {
  if (!SUPABASE_URL || !ANON_KEY) {
    return undefined;
  }

  return createBrowserClient(SUPABASE_URL, ANON_KEY);
}

export const supabaseClient = createClient();
