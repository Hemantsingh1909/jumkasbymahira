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

    // 2. Trigger Email Notification via Resend (if API key is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'sshreecollection593@gmail.com';
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: `Jhumkas by Malti <${fromEmail}>`,
            to: adminEmail,
            subject: `✨ New Inquiry: ${subject || 'Customer Message'}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                <h2 style="color: #6d1b36; border-bottom: 2px solid #6d1b36; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 100px;">Name:</td>
                    <td style="padding: 6px 0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                    <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
                    <td style="padding: 6px 0;">${phone || 'Not Provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Subject:</td>
                    <td style="padding: 6px 0;">${subject || 'No Subject'}</td>
                  </tr>
                </table>
                <div style="margin-top: 20px; padding: 15px; background-color: #fdfafb; border: 1px solid #f7ebef; border-radius: 6px;">
                  <h4 style="margin: 0 0 10px 0; color: #6d1b36;">Message:</h4>
                  <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; color: #333333;">${message}</p>
                </div>
                <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0 20px 0;" />
                <p style="font-size: 12px; color: #666666; margin: 0; text-align: center;">This message was securely captured and stored in your Supabase admin database.</p>
              </div>
            `
          })
        });
      } catch (emailError) {
        console.error('Resend notification failed:', emailError);
      }
    } else {
      console.log('Resend not configured: RESEND_API_KEY environment variable is missing.');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in contact box submission:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit contact message' }, { status: 500 });
  }
}
