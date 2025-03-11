// src/pages/CartPage.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { incrementItem, decrementItem, removeItem } from "../store/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-jewelry-600">
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
            {/* Cart Items - Left Column */}
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
                        <Link to={`/product/${item.id}`} className="block">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md mr-4"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="font-medium text-gray-800 hover:text-jewelry-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Unit Price: ₹{item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center mt-3">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => dispatch(decrementItem(item.id))}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-l-md hover:bg-gray-200 transition-colors"
                              >
                                <i className="fas fa-minus text-xs"></i>
                              </button>
                              <span className="px-4 py-1 text-gray-800 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => dispatch(incrementItem(item.id))}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-r-md hover:bg-gray-200 transition-colors"
                              >
                                <i className="fas fa-plus text-xs"></i>
                              </button>
                            </div>
                            <button
                              onClick={() => dispatch(removeItem(item.id))}
                              className="ml-4 text-red-500 text-sm hover:text-red-700 transition-colors"
                            >
                              <i className="fas fa-trash-alt mr-1"></i> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-jewelry-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h2 className="text-xl font-medium text-jewelry-800 mb-6 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">₹99.00</span>
                  </div>
                  <div className="border-t border-gray-200 my-4 pt-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-jewelry-800">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-jewelry-800">
                      ₹{(parseFloat(calculateTotal()) + 99).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <Link
                    to="/checkout"
                    className="block w-full py-3 px-4 bg-jewelry-600 text-white text-center font-medium rounded-md hover:bg-jewelry-700 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/products"
                    className="block w-full py-3 px-4 bg-white text-jewelry-600 text-center font-medium rounded-md border border-jewelry-600 hover:bg-jewelry-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl text-gray-300 mb-6">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2 className="text-2xl font-medium text-gray-700 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any jewelry to your cart yet.
              Browse our collection to find something you&apos;ll love!
            </p>
            <Link
              to="/products"
              className="inline-block py-3 px-6 bg-jewelry-600 text-white font-medium rounded-md hover:bg-jewelry-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
