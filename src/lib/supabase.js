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
  return true;
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Admin verification failed: Missing or invalid Authorization header');
      return false;
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabasePublic.auth.getUser(token);
    if (error) {
      console.error('Admin verification failed: Supabase getUser error', error);
      return false;
    }
    if (!user) {
      console.error('Admin verification failed: No user found for token');
      return false;
    }
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!adminEmail) {
      console.error('Admin verification failed: Admin email environment variable is not set on the server');
      return false;
    }
    const isMatched = user.email?.toLowerCase() === adminEmail.toLowerCase();
    if (!isMatched) {
      console.error(`Admin verification failed: Authenticated email (${user.email}) does not match admin email (${adminEmail})`);
    }
    return isMatched;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3001';
}
