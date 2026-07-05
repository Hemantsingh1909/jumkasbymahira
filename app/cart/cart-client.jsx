'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { incrementItem, decrementItem, removeItem } from '@/src/store/cartSlice';
import { calculateShippingFee, calculateOrderTotal } from '@/src/lib/shipping';
import { getProductUrl } from '@/src/lib/slug';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartClient() {
  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = calculateShippingFee(subtotal);
  const total = calculateOrderTotal(subtotal);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom mx-auto px-4">
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-jewelry-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-serif font-bold mb-8 text-center text-jewelry-800">
          Your Shopping Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium text-jewelry-800">
                      Cart Items ({cartItems.length})
                    </h2>
                    <span className="text-sm text-gray-500">Price</span>
                  </div>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center">
                        <Link href={getProductUrl(item)} className="block">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md mr-4"
                          />
                        </Link>
                        <div>
                          <Link
                            href={getProductUrl(item)}
                            className="font-medium text-gray-800 hover:text-jewelry-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Unit Price: ₹{Number(product.price || 0).toFixed(2)}
                          </p>
                          <div className="flex items-center mt-3">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => dispatch(decrementItem(item.id))}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-l-md hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-3 h-3 mx-auto" />
                              </button>
                              <span className="px-4 py-1 text-gray-800 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => dispatch(incrementItem(item.id))}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-r-md hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-3 h-3 mx-auto" />
                              </button>
                            </div>
                            <button
                              onClick={() => dispatch(removeItem(item.id))}
                              className="ml-4 text-red-500 text-sm hover:text-red-700 transition-colors flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-jewelry-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="text-lg font-medium text-jewelry-800 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">
                      {shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                </div>
                <div className="flex justify-between mb-6 text-lg">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-jewelry-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="block text-center bg-jewelry-600 text-white py-3 rounded hover:bg-jewelry-700 transition-colors font-medium mb-3"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/products"
                  className="block text-center bg-gray-100 text-gray-800 py-3 rounded hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block bg-jewelry-600 text-white py-3 px-6 rounded hover:bg-jewelry-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
