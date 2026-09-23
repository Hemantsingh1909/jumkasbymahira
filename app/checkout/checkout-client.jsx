'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearCart } from '@/src/store/cartSlice';
import { calculateShippingFee, calculateOrderTotal } from '@/src/lib/shipping';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutClient() {
  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay',
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cartItems.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [cartItems.length, router, orderPlaced]);

  // Preload Razorpay checkout SDK
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (paymentError) {
      setPaymentError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode.replace(/\D/g, ''))) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = calculateShippingFee(subtotal);
  const total = calculateOrderTotal(subtotal);

  const handleRazorpayCheckout = async () => {
    setSubmitting(true);
    setPaymentError(null);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.');
      }

      // Step 1: Create Order on Backend
      const amountInPaise = Math.round(total * 100);
      const createOrderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customerName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
          },
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      const razorpayKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TfWjAlOdHEGvng';

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Jhumkas by Malti',
        description: `Order Payment (${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'})`,
        image: '/icon.png',
        order_id: orderData.order_id,
        handler: async function (response) {
          // Step 3: Verify Payment Signature on Backend
          try {
            setSubmitting(true);
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  items: cartItems.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    selectedSize: item.selectedSize || null,
                  })),
                  customer: formData,
                  subtotal,
                  shipping: shippingFee,
                  total,
                },
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              const completedOrder = verifyData.order || {
                customer: { ...formData, paymentMethod: 'razorpay' },
                items: cartItems,
                subtotal,
                shipping: shippingFee,
                total,
                invoiceNo: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
                payment_id: response.razorpay_payment_id,
              };

              setPlacedOrder(completedOrder);
              setOrderPlaced(true);
              dispatch(clearCart());
            } else {
              setPaymentError(
                verifyData.error ||
                  'Payment verification failed. If your account was debited, please contact us with Payment ID: ' +
                    response.razorpay_payment_id
              );
            }
          } catch (err) {
            console.error('Error during payment verification:', err);
            setPaymentError(
              'An error occurred verifying your payment. Payment ID: ' +
                response.razorpay_payment_id +
                '. Please contact support.'
            );
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        },
        theme: {
          color: '#831843',
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
            setPaymentError('Payment window was closed. You can retry or switch payment methods.');
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Razorpay Payment Failed:', response.error);
        setPaymentError(
          response.error?.description ||
            response.error?.reason ||
            'Payment failed. Please try another payment method.'
        );
        setSubmitting(false);
      });

      rzp.open();
    } catch (error) {
      console.error('Razorpay Checkout initialization error:', error);
      setPaymentError(error.message || 'Unable to start online payment. Please try again.');
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || submitting) {
      return;
    }

    if (formData.paymentMethod === 'razorpay') {
      await handleRazorpayCheckout();
    } else if (formData.paymentMethod === 'cod') {
      setSubmitting(true);
      setPaymentError(null);
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              selectedSize: item.selectedSize || null,
            })),
            customer: formData,
            subtotal,
            shipping: shippingFee,
            total,
          }),
        });

        if (response.ok) {
          const newOrder = await response.json();
          setPlacedOrder(newOrder);
          setOrderPlaced(true);
          dispatch(clearCart());
        } else {
          const data = await response.json();
          setPaymentError(data.error || 'Failed to place COD order.');
        }
      } catch (error) {
        console.error('Error placing COD order:', error);
        setPaymentError(error.message || 'An unexpected error occurred while placing your order.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getWhatsAppLink = () => {
    if (!placedOrder) return '#';
    const customer = placedOrder.customer || formData;
    const customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
    const itemsText = (placedOrder.items || cartItems)
      .map(
        (item) =>
          `- ${item.name}${item.selectedSize ? ` (Size: ${item.selectedSize})` : ''} x ${item.quantity} (₹${Number(item.price || 0).toFixed(2)})`
      )
      .join('\n');
    const shippingText = placedOrder.shipping === 0 ? 'Free' : `₹${Number(placedOrder.shipping || 0).toFixed(2)}`;
    const paymentMethodText =
      customer.paymentMethod === 'razorpay'
        ? `PAID ONLINE (Razorpay ID: ${customer.razorpay_payment_id || placedOrder.payment_id || 'Verified'})`
        : 'CASH ON DELIVERY (COD)';

    const message = `Hello Jhumkas by Malti,

I've just placed a new order! Here are the details:
Invoice No: ${placedOrder.invoiceNo || 'PENDING'}
Customer Name: ${customerName}
Phone: +91 ${customer.phone}
Address: ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}

Items Ordered:
${itemsText}

Subtotal: ₹${Number(placedOrder.subtotal || subtotal).toFixed(2)}
Shipping: ${shippingText}
Total Amount: ₹${Number(placedOrder.total || total).toFixed(2)}
Payment Status: ${paymentMethodText}

Please confirm my order. Thank you!`;

    return `https://wa.me/918238672255?text=${encodeURIComponent(message)}`;
  };

  if (orderPlaced && placedOrder) {
    const isPaidOnline = placedOrder.customer?.paymentMethod === 'razorpay' || placedOrder.payment_method === 'razorpay';
    const paymentId = placedOrder.customer?.razorpay_payment_id || placedOrder.payment_id;

    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-jewelry-700 via-jewelry-800 to-jewelry-900 text-white p-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 shadow-inner">
              <svg
                className="w-8 h-8 text-green-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-jewelry-100 text-sm md:text-base">
              Invoice Number:{' '}
              <span className="font-mono font-bold text-yellow-300 bg-black/20 px-2 py-0.5 rounded">
                {placedOrder.invoiceNo}
              </span>
            </p>
            {isPaidOnline && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-green-500/20 text-green-200 border border-green-400/30 text-xs px-3 py-1 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Payment Verified via Razorpay {paymentId ? `(#${paymentId})` : ''}
              </div>
            )}
          </div>

          {/* Receipt Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-6 gap-4">
              <div>
                <h3 className="font-bold text-gray-800 text-base mb-2">Customer Details</h3>
                <p className="text-gray-600 font-medium">
                  {placedOrder.customer.firstName} {placedOrder.customer.lastName}
                </p>
                <p className="text-gray-500 text-sm">{placedOrder.customer.email}</p>
                <p className="text-gray-500 text-sm">Phone: +91 {placedOrder.customer.phone}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base mb-2">Shipping Address</h3>
                <p className="text-gray-600 text-sm">{placedOrder.customer.address}</p>
                <p className="text-gray-600 text-sm">
                  {placedOrder.customer.city}, {placedOrder.customer.state} - {placedOrder.customer.pincode}
                </p>
                <div className="mt-2">
                  <span className="inline-block text-xs uppercase font-semibold px-2.5 py-0.5 rounded-full bg-jewelry-50 text-jewelry-800 border border-jewelry-200">
                    Payment Mode: {isPaidOnline ? 'Online (Razorpay)' : 'Cash on Delivery'}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-3">Ordered Items</h3>
              <div className="space-y-3 border-b border-gray-100 pb-6">
                {placedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-700 font-medium">
                      {item.name}{' '}
                      {item.selectedSize && (
                        <span className="text-xs text-jewelry-700 font-bold bg-jewelry-50 px-1.5 py-0.5 rounded ml-1">
                          Size: {item.selectedSize}
                        </span>
                      )}{' '}
                      <span className="text-gray-400 font-normal">x {item.quantity}</span>
                    </span>
                    <span className="text-gray-800 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 border-b border-gray-100 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700 font-medium">₹{Number(placedOrder.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">
                  {placedOrder.shipping === 0 ? 'Free' : `₹${Number(placedOrder.shipping).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span className="text-gray-800">Total Paid</span>
                <span className="text-jewelry-800">₹{Number(placedOrder.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path d="M12.012 2c-5.506 0-9.97 4.463-9.97 9.969 0 1.93.546 3.732 1.499 5.279L2 22l4.902-1.286c1.474.808 3.161 1.272 4.957 1.272 5.505 0 9.97-4.464 9.97-9.97C21.929 6.463 17.517 2 12.012 2zm6.368 14.54c-.263.742-1.528 1.353-2.1 1.393-.572.04-1.298.058-2.096-.2-3.176-1.026-5.215-4.225-5.373-4.437-.159-.212-1.286-1.713-1.286-3.267 0-1.554.815-2.319 1.107-2.617.291-.297.635-.371.847-.371.212 0 .424.001.609.009.193.008.45-.072.705.545.263.636.9 2.196.979 2.356.079.16.132.348.026.559-.106.212-.159.344-.318.528-.159.184-.334.409-.477.551-.159.159-.328.329-.142.648.185.318.823 1.356 1.764 2.197.94.84 1.731 1.102 2.049 1.261.318.16.504.133.689-.08.185-.212.802-.931 1.02-1.25.212-.319.424-.265.715-.159.292.106 1.854.874 2.172 1.034.318.16.53.238.609.371.079.133.079.742-.184 1.484z" />
                </svg>
                Send Order Invoice to WhatsApp
              </a>

              <Link
                href="/"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-colors"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-jewelry-800 font-serif">
        Secure Checkout
      </h1>

      {paymentError && (
        <div className="mb-6 max-w-4xl mx-auto p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 shadow-sm animate-shake">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-800">Checkout Notification</h4>
            <p className="text-sm text-red-700 mt-0.5">{paymentError}</p>
          </div>
          <button
            onClick={() => setPaymentError(null)}
            className="text-red-400 hover:text-red-600 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <h2 className="text-xl font-bold mb-6 text-jewelry-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-jewelry-100 text-jewelry-800 text-sm font-bold">1</span>
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Malti"
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.firstName ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma"
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.lastName ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@example.com"
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.email ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                  Phone Number (10 digits) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">+91</span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    maxLength="10"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className={`w-full pl-12 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                      errors.phone ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House / Flat No., Apartment, Street, Landmark"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                  errors.address ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.city ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-1">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.state ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <label htmlFor="pincode" className="block text-gray-700 text-sm font-medium mb-1">
                  Pincode (6 digits) *
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  maxLength="6"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.pincode ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 text-jewelry-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-jewelry-100 text-jewelry-800 text-sm font-bold">2</span>
              Payment Method
            </h2>
            
            <div className="space-y-3 mb-8">
              {/* Razorpay Option */}
              <label
                className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'razorpay'
                    ? 'border-jewelry-600 bg-jewelry-50/40 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={formData.paymentMethod === 'razorpay'}
                    onChange={handleChange}
                    className="h-4 w-4 text-jewelry-600 focus:ring-jewelry-500 border-gray-300 accent-jewelry-700"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      Online Payment (UPI, Cards, NetBanking, Wallets)
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                        Recommended • Fast & Secure
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Instant payment confirmation powered by Razorpay Standard Checkout. Supports GPay, PhonePe, Paytm, All Major Cards & Netbanking.
                  </p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                    <span className="inline-flex items-center font-semibold text-gray-600">
                      🔒 256-bit Encrypted
                    </span>
                    <span>•</span>
                    <span>Razorpay Verified</span>
                  </div>
                </div>
              </label>

              {/* COD Option */}
              <label
                className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'border-jewelry-600 bg-jewelry-50/40 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="h-4 w-4 text-jewelry-600 focus:ring-jewelry-500 border-gray-300 accent-jewelry-700"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <span className="text-sm font-semibold text-gray-900 block">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pay with cash when your artisanal jewelry arrives at your doorstep.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-jewelry-700 to-jewelry-900 hover:from-jewelry-800 hover:to-jewelry-950 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Checkout...
                </>
              ) : formData.paymentMethod === 'razorpay' ? (
                `Pay ₹${total.toFixed(2)} via Razorpay`
              ) : (
                `Place COD Order (₹${total.toFixed(2)})`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-jewelry-800 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </h3>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize || ''}`} className="flex justify-between items-center text-sm gap-2 py-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {item.selectedSize && (
                        <span className="text-jewelry-700 font-semibold bg-jewelry-50 px-1.5 py-0.2 rounded">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-800 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-semibold">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-jewelry-800">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Buyer Protection & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
