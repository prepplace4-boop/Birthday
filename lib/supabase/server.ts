import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type ServerClient = ReturnType<typeof createServerClient>;
type TypedSupabaseClient = ServerClient | undefined;

export async function createClient(): Promise<TypedSupabaseClient> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return undefined;
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: readonly {
          name: string;
          value: string;
          options?: CookieOptions;
        }[],
      ) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

export const supabaseServer: TypedSupabaseClient = undefined;
