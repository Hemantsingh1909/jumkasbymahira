import { createClient } from '@supabase/supabase-js';

// Server-side client — uses the service role key, bypasses RLS.
// Only import this inside app/api/** route handlers, never in client components.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Public client — safe for use in Server Components for read-only product fetches.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
