import { NextResponse } from 'next/server';
import { getRazorpayInstance } from '@/src/lib/razorpay';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    let { amount, currency = 'INR', receipt, notes } = body;

    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: 'Amount is required and must be a valid number' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amount));

    // Minimum amount validation (100 paise = ₹1)
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (₹1)' },
        { status: 400 }
      );
    }

    let razorpay;
    try {
      razorpay = getRazorpayInstance();
    } catch (configError) {
      return NextResponse.json(
        { error: 'Razorpay configuration error: ' + configError.message },
        { status: 401 }
      );
    }

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      ...(notes ? { notes } : {}),
    };

    const order = await razorpay.orders.create(options);

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    return NextResponse.json({
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      key_id: keyId,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    if (error?.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR' && error?.error?.description?.includes('auth')) {
      return NextResponse.json(
        { error: 'Razorpay authentication failed. Please check your API keys.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error?.error?.description || error.message || 'Failed to create Razorpay order' },
      { status: error?.statusCode || 500 }
    );
  }
}
