import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase';

export async function POST(request) {
  try {
    const { email } = await request.json();

    const { error } = await supabaseAdmin
      .from('newsletter_signups')
      .insert({ email });

    if (error) {
      // Postgres unique constraint violation code '23505'
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in newsletter subscription:', error);
    return NextResponse.json({ error: error.message || 'Subscription failed' }, { status: 500 });
  }
}
