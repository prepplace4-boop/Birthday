import { createClient as createServerClient } from '@/lib/supabase/server';

async function seed() {
  const supabase = await createServerClient();

  if (!supabase) {
    console.warn(
      '[seed] Supabase env vars not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). Skipping DB seed.',
    );
    console.info(
      '[seed] Copy .env.example to .env and fill in Supabase credentials to run seeds against the database.',
    );
    process.exit(0);
  }

  console.log('[seed] Supabase client available. Ready to run seed inserts.');
  console.log(
    '[seed] Add your seed inserts below. Default rows for `days` and `journey_settings` are included in migration 0001.',
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Unhandled error:', err);
  process.exit(1);
});
