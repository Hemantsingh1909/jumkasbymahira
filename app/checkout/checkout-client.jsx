'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearCart } from '@/src/store/cartSlice';
import { calculateShippingFee, calculateOrderTotal } from '@/src/lib/shipping';

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
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cartItems.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [cartItems.length, router, orderPlaced]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
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
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm() && !submitting) {
      setSubmitting(true);
      try {
        if (formData.paymentMethod === 'cod') {
          // Process Cash on Delivery immediately
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                selectedSize: item.selectedSize
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
            alert(data.error || 'Failed to place order.');
          }
        }
      } catch (error) {
        console.error('Error processing order flow:', error);
        alert(error.message || 'An unexpected checkout error occurred.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getWhatsAppLink = () => {
    if (!placedOrder) return '#';
    const customerName = `${placedOrder.customer.firstName} ${placedOrder.customer.lastName}`;
    const itemsText = placedOrder.items
      .map((item) => `- ${item.name}${item.selectedSize ? ` (Size: ${item.selectedSize})` : ''} x ${item.quantity} (₹${Number(item.price || 0).toFixed(2)})`)
      .join('\n');
    const shippingText = placedOrder.shipping === 0 ? 'Free' : `₹${placedOrder.shipping.toFixed(2)}`;

    const message = `Hello Jhumkas by Malti,

I've just placed a new order! Here are the details:
Invoice No: ${placedOrder.invoiceNo}
Customer Name: ${customerName}
Phone: +91 ${placedOrder.customer.phone}
Address: ${placedOrder.customer.address}, ${placedOrder.customer.city}, ${placedOrder.customer.state} - ${placedOrder.customer.pincode}

Items Ordered:
${itemsText}

Subtotal: ₹${placedOrder.subtotal.toFixed(2)}
Shipping: ${shippingText}
Total Amount: ₹${placedOrder.total.toFixed(2)}
Payment Method: ${placedOrder.customer.paymentMethod.toUpperCase()}

Please confirm my order. Thank you!`;

    return `https://wa.me/918238672255?text=${encodeURIComponent(message)}`;
  };

  if (orderPlaced && placedOrder) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full p-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-green-100">Invoice Number: <span className="font-mono font-bold text-yellow-300">{placedOrder.invoiceNo}</span></p>
          </div>

          {/* Receipt Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-6 gap-4">
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">Customer Details</h3>
                <p className="text-gray-600">{placedOrder.customer.firstName} {placedOrder.customer.lastName}</p>
                <p className="text-gray-600">Email: {placedOrder.customer.email}</p>
                <p className="text-gray-600">Phone: +91 {placedOrder.customer.phone}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">Shipping Address</h3>
                <p className="text-gray-600">{placedOrder.customer.address}</p>
                <p className="text-gray-600">{placedOrder.customer.city}, {placedOrder.customer.state} - {placedOrder.customer.pincode}</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-4">Ordered Items</h3>
              <div className="space-y-4 border-b border-gray-100 pb-6">
                {placedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-medium">
                      {item.name} {item.selectedSize && <span className="text-xs text-jewelry-600 font-bold bg-jewelry-50 px-1.5 py-0.5 rounded">(Size: {item.selectedSize})</span>} <span className="text-gray-400 font-normal">x {item.quantity}</span>
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
                <span className="text-gray-700">₹{placedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-700">{placedOrder.shipping === 0 ? 'Free' : `₹${placedOrder.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span className="text-gray-800">Total</span>
                <span className="text-jewelry-600">₹{placedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 text-center"
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
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors"
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
      <h1 className="text-3xl font-bold mb-8 text-center text-jewelry-800">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-bold mb-6 text-jewelry-800">
              Customer Information
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
                  className={`w-full p-2.5 border rounded ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
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
                  className={`w-full p-2.5 border rounded ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2.5 border rounded ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                  Phone (10 digits) *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-2.5 border rounded ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-1">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full p-2.5 border rounded ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full p-2.5 border rounded ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
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
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`w-full p-2.5 border rounded ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 text-jewelry-800">
              Payment Method
            </h2>
            <div className="mb-8 space-y-3 bg-jewelry-50/50 p-4 rounded-lg border border-jewelry-100">
              <label className="flex items-center text-sm font-medium cursor-pointer text-gray-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="mr-2.5 h-4 w-4 accent-jewelry-600"
                />
                <span>Cash on Delivery (COD)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-jewelry-600 text-white py-3.5 rounded-lg hover:bg-jewelry-700 font-bold transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              {submitting ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h3 className="text-xl font-bold mb-4 text-jewelry-800 border-b border-gray-100 pb-3">
              Order Summary
            </h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize || ''}`} className="flex justify-between text-sm gap-2">
                  <span className="text-gray-600 font-medium line-clamp-1">
                    {item.name} {item.selectedSize && <span className="text-xs text-jewelry-600 font-semibold">(Size: {item.selectedSize})</span>} <span className="text-gray-400 text-xs">x {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-semibold">
                  {shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                <span>Total</span>
                <span className="text-jewelry-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
