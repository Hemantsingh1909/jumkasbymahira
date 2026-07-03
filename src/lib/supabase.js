import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url-for-build-only.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// Server-side client — uses the service role key, bypasses RLS.
// Only import this inside app/api/** route handlers, never in client components.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Public client — safe for use in Server Components for read-only product fetches.
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

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
    return user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}
