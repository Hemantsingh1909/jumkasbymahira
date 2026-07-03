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

// Server-side helper to verify auth headers and enforce Malti's admin restriction
export async function verifyAdminSession(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabasePublic.auth.getUser(token);
    if (error || !user) return false;
    return user.email === 'sshreecolllection593@gmail.com';
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}
