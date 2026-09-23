import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/src/lib/razorpay';
import { supabaseAdmin } from '@/src/lib/supabase';
import { calculateShippingFee, calculateOrderTotal } from '@/src/lib/shipping';

function formatInvoiceNo(orderId, dateString) {
  const year = new Date(dateString || new Date()).getFullYear();
  const formattedId = String(orderId).padStart(4, '0');
  return `INV-${year}-${formattedId}`;
}

function mapOrderStatusToFrontend(status) {
  if (status === 'new') return 'New';
  if (status === 'processing') return 'Processing';
  if (status === 'shipped') return 'Shipped';
  if (status === 'delivered') return 'Delivered';
  return status || 'New';
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const order_id = body.razorpay_order_id || body.order_id;
    const payment_id = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;

    // Check required fields
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)',
        },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature
    let isValid = false;
    try {
      isValid = verifyRazorpaySignature({
        order_id,
        payment_id,
        signature,
      });
    } catch (err) {
      return NextResponse.json(
        { success: false, error: err.message || 'Signature verification failed' },
        { status: 500 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature. Payment verification failed.' },
        { status: 400 }
      );
    }

    // If orderData was provided, record the confirmed order in the database
    let placedOrder = null;
    if (body.orderData) {
      const { items, customer } = body.orderData;
      const subtotal = (items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = calculateShippingFee(subtotal);
      const total = calculateOrderTotal(subtotal);

      const customerWithPayment = {
        ...customer,
        paymentMethod: 'razorpay',
        razorpay_order_id: order_id,
        razorpay_payment_id: payment_id,
      };

      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert({
          customer: customerWithPayment,
          items,
          subtotal,
          shipping,
          total,
          payment_method: 'razorpay',
          status: 'new',
        })
        .select()
        .single();

      if (!error && data) {
        placedOrder = {
          ...data,
          status: mapOrderStatusToFrontend(data.status),
          invoiceNo: formatInvoiceNo(data.id, data.created_at),
        };

        // Send Email Notifications via Resend if configured
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          try {
            const fromEmail = process.env.RESEND_FROM_EMAIL || 'support@jhumkasbymalti.com';
            const adminEmail = process.env.ADMIN_EMAIL || 'sshreecollection593@gmail.com';
            const invoiceNo = placedOrder.invoiceNo;
            const customerAddress = `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`;
            const itemsListHtml = (items || []).map(item => `
              <tr>
                <td style="padding: 12px 10px; border-bottom: 1px solid #f1f1f1; color: #333333; font-size: 14px;">
                  ${item.name}
                  ${item.selectedSize ? `<br/><span style="font-size: 12px; color: #6d1b36; font-weight: bold;">Size: ${item.selectedSize}</span>` : ''}
                </td>
                <td style="padding: 12px 10px; border-bottom: 1px solid #f1f1f1; color: #666666; font-size: 14px; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px 10px; border-bottom: 1px solid #f1f1f1; color: #333333; font-size: 14px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('');

            await Promise.allSettled([
              fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify({
                  from: `Jhumkas by Malti <${fromEmail}>`,
                  to: customer.email,
                  subject: `✨ Order Confirmed (Paid Online)! ${invoiceNo}`,
                  html: `
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                      <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #6d1b36; margin: 0; font-size: 26px; font-weight: bold;">Jhumkas by Malti</h1>
                        <p style="color: #16a34a; font-size: 15px; font-weight: 600; margin-top: 5px;">Payment Received & Order Confirmed</p>
                      </div>
                      <p style="font-size: 16px; color: #1f2937;">Hi ${customer.firstName || 'Customer'},</p>
                      <p style="font-size: 15px; color: #4b5563;">Thank you for your payment! Your transaction <strong>${payment_id}</strong> was successful.</p>
                      <div style="background-color: #fcf8f9; border: 1px solid #f3e6e9; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <p><strong>Invoice Number:</strong> ${invoiceNo}</p>
                        <p><strong>Payment ID:</strong> ${payment_id}</p>
                        <p><strong>Total Paid:</strong> ₹${parseFloat(total).toFixed(2)}</p>
                      </div>
                    </div>
                  `,
                }),
              }),
            ]);
          } catch (mailErr) {
            console.error('Email error in verify-payment:', mailErr);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
      order: placedOrder,
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
