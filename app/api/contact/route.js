import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase';

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name,
        email,
        phone,
        subject,
        message
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in contact box submission:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit contact message' }, { status: 500 });
  }
}
