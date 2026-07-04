import { NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin, verifyAdminSession } from '@/src/lib/supabase';
import { calculateShippingFee, calculateOrderTotal } from '@/src/lib/shipping';
import crypto from 'crypto';

function mapOrderStatusToFrontend(status) {
  if (status === 'new') return 'New';
  if (status === 'processing') return 'Processing';
  if (status === 'shipped') return 'Shipped';
  if (status === 'delivered') return 'Delivered';
  return status || 'New';
}

function mapOrderStatusToDb(status) {
  if (status === 'New') return 'new';
  if (status === 'Processing') return 'processing';
  if (status === 'Shipped') return 'shipped';
  if (status === 'Delivered') return 'delivered';
  return status || 'new';
}

function formatInvoiceNo(orderId, dateString) {
  const year = new Date(dateString || new Date()).getFullYear();
  const formattedId = String(orderId).padStart(4, '0');
  return `INV-${year}-${formattedId}`;
}

export async function GET(request) {
  const isAdmin = await verifyAdminSession(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    const orders = (data || []).map(o => ({
      ...o,
      status: mapOrderStatusToFrontend(o.status),
      invoiceNo: formatInvoiceNo(o.id, o.created_at),
      // Ensure frontend customer state gets parsed correctly
      customer: typeof o.customer === 'string' ? JSON.parse(o.customer) : o.customer,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders from Supabase:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    // Secure server-side calculation using centralized utility
    const subtotal = (items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = calculateShippingFee(subtotal);
    const total = calculateOrderTotal(subtotal);

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        customer,
        items,
        subtotal,
        shipping,
        total,
        payment_method: customer.paymentMethod || 'cod',
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger Email Notifications via Resend (if API key is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'contact@jhumkasbymalti.in';
        const adminEmail = process.env.ADMIN_EMAIL || 'sshreecollection593@gmail.com';
        const invoiceNo = formatInvoiceNo(data.id, data.created_at);

        const customerAddress = `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`;
        const itemsListHtml = (items || []).map(item => `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f1f1; color: #333333; font-size: 14px;">${item.name}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f1f1; color: #666666; font-size: 14px; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f1f1; color: #333333; font-size: 14px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('');

        // Email 1: To the Customer
        const customerMailPromise = fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: `Jhumkas by Malti <${fromEmail}>`,
            to: customer.email,
            subject: `✨ Order Confirmed! ${invoiceNo}`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #6d1b36; margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 0.5px;">Jhumkas by Malti</h1>
                  <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Your order has been successfully placed</p>
                </div>
                
                <p style="font-size: 16px; color: #1f2937; line-height: 1.5; margin-top: 0;">Hi ${customer.firstName || 'Customer'},</p>
                <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                  Thank you for shopping with us! We have received your order and are preparing it with care. Below are your order details and invoice information.
                </p>

                <div style="background-color: #fcf8f9; border: 1px solid #f3e6e9; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                      <td style="padding: 4px 0; color: #6b7280;">Invoice Number:</td>
                      <td style="padding: 4px 0; font-weight: bold; color: #1f2937; text-align: right;">${invoiceNo}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #6b7280;">Payment Method:</td>
                      <td style="padding: 4px 0; font-weight: bold; color: #1f2937; text-align: right; text-transform: uppercase;">${customer.paymentMethod || 'cod'}</td>
                    </tr>
                  </table>
                </div>

                <h3 style="color: #6d1b36; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 0; margin-bottom: 12px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; text-align: left; font-size: 12px; color: #4b5563; text-transform: uppercase;">Item</th>
                      <th style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #4b5563; text-transform: uppercase; width: 60px;">Qty</th>
                      <th style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 12px; color: #4b5563; text-transform: uppercase; width: 100px;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsListHtml}
                  </tbody>
                </table>

                <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 30px;">
                  <tr>
                    <td style="padding: 6px 0; color: #4b5563;">Subtotal:</td>
                    <td style="padding: 6px 0; text-align: right; color: #1f2937;">₹${parseFloat(subtotal).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #4b5563;">Shipping:</td>
                    <td style="padding: 6px 0; text-align: right; color: #1f2937;">${shipping > 0 ? `₹${parseFloat(shipping).toFixed(2)}` : 'FREE'}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e5e7eb;">
                    <td style="padding: 12px 0 6px 0; font-size: 16px; font-weight: bold; color: #6d1b36;">Total Amount:</td>
                    <td style="padding: 12px 0 6px 0; font-size: 16px; font-weight: bold; text-align: right; color: #6d1b36;">₹${parseFloat(total).toFixed(2)}</td>
                  </tr>
                </table>

                <h3 style="color: #6d1b36; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 0; margin-bottom: 12px;">Delivery Address</h3>
                <div style="font-size: 14px; color: #4b5563; line-height: 1.5; margin-bottom: 30px; background-color: #f9fafb; padding: 15px; border-radius: 8px;">
                  <strong style="color: #1f2937;">${customer.firstName} ${customer.lastName}</strong><br/>
                  ${customerAddress}<br/>
                  Phone: ${customer.phone}
                </div>

                <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 25px; margin-top: 30px;">
                  <p style="font-size: 14px; color: #4b5563; margin-bottom: 5px;">If you have any questions, feel free to reply to this email or contact us on WhatsApp.</p>
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">&copy; ${new Date().getFullYear()} Jhumkas by Malti. All rights reserved.</p>
                </div>
              </div>
            `
          })
        });

        // Email 2: To the Admin
        const adminMailPromise = fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: `Jhumkas by Malti <${fromEmail}>`,
            to: adminEmail,
            subject: `🔔 New Order Placed: ${invoiceNo}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                <h2 style="color: #6d1b36; border-bottom: 2px solid #6d1b36; padding-bottom: 10px; margin-top: 0;">New Order Notification</h2>
                <p style="font-size: 15px; color: #333333;">A new customer order has been placed on the storefront.</p>
                
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin-bottom: 20px; font-size: 14px;">
                  <h4 style="margin: 0 0 10px 0; color: #6d1b36; font-size: 15px;">Invoice Details</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="color: #666666; padding: 3px 0;">Invoice Number:</td>
                      <td style="font-weight: bold; color: #333333; text-align: right;">${invoiceNo}</td>
                    </tr>
                    <tr>
                      <td style="color: #666666; padding: 3px 0;">Total Amount:</td>
                      <td style="font-weight: bold; color: #6d1b36; text-align: right;">₹${parseFloat(total).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="color: #666666; padding: 3px 0;">Payment Mode:</td>
                      <td style="font-weight: bold; color: #333333; text-align: right; text-transform: uppercase;">${customer.paymentMethod || 'cod'}</td>
                    </tr>
                  </table>
                </div>

                <div style="background-color: #fcf8f9; border: 1px solid #f3e6e9; border-radius: 6px; padding: 15px; margin-bottom: 20px; font-size: 14px;">
                  <h4 style="margin: 0 0 10px 0; color: #6d1b36; font-size: 15px;">Customer Delivery Info</h4>
                  <p style="margin: 3px 0;"><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
                  <p style="margin: 3px 0;"><strong>Email:</strong> <a href="mailto:${customer.email}">${customer.email}</a></p>
                  <p style="margin: 3px 0;"><strong>Phone:</strong> ${customer.phone}</p>
                  <p style="margin: 3px 0;"><strong>Address:</strong> ${customerAddress}</p>
                </div>

                <h4 style="color: #6d1b36; margin: 15px 0 10px 0; font-size: 15px; border-bottom: 1px solid #eaeaea; padding-bottom: 6px;">Order Items</h4>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 6px; border-bottom: 1px solid #eaeaea; text-align: left; font-size: 12px; color: #666666;">Item Name</th>
                      <th style="padding: 6px; border-bottom: 1px solid #eaeaea; text-align: center; font-size: 12px; color: #666666; width: 60px;">Qty</th>
                      <th style="padding: 6px; border-bottom: 1px solid #eaeaea; text-align: right; font-size: 12px; color: #666666; width: 100px;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsListHtml}
                  </tbody>
                </table>
              </div>
            `
          })
        });

        // Send concurrently
        const [customerRes, adminRes] = await Promise.all([customerMailPromise, adminMailPromise]);

        if (!customerRes.ok) {
          console.error('Failed to send customer order confirmation email:', customerRes.status, await customerRes.text());
        }
        if (!adminRes.ok) {
          console.error('Failed to send admin order notification email:', adminRes.status, await adminRes.text());
        }
      } catch (emailError) {
        console.error('Order notification emails failed:', emailError);
      }
    }

    return NextResponse.json({
      ...data,
      status: mapOrderStatusToFrontend(data.status),
      invoiceNo: formatInvoiceNo(data.id, data.created_at)
    });
  } catch (error) {
    console.error('Error creating order in Supabase:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
