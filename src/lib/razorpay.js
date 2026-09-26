import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpayInstance() {
  const key_id = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
  const key_secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials are not configured in environment variables.');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export function verifyRazorpaySignature({ order_id, payment_id, signature }) {
  const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  if (!secret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured.');
  }

  if (!order_id || !payment_id || !signature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');

  return generatedSignature === signature;
}
