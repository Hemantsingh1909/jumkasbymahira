import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/src/lib/razorpay';
import { supabaseAdmin } from '@/src/lib/supabase';
import { calculateShippingFee, calculateOrderTotal } from '@/src/lib/shipping';
import { sendOrderEmails } from '@/src/lib/email';

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

        // Send Email Notifications via Resend to both Customer and Owner
        try {
          await sendOrderEmails({
            order: placedOrder,
            items,
            customer,
            subtotal,
            shipping,
            total,
            invoiceNo: placedOrder.invoiceNo,
            paymentMethod: 'razorpay',
            paymentId: payment_id,
          });
        } catch (mailErr) {
          console.error('Email sending error in verify-payment:', mailErr);
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
