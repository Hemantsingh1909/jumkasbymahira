import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCartItem, setAddedToCartItem] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Load wishlist from localStorage
    const loadWishlist = () => {
      setIsLoading(true);
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistItems(wishlist);
      setIsLoading(false);
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => item.id !== productId
    );
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);

    // Dispatch custom event to notify other components about wishlist changes
    const wishlistEvent = new CustomEvent("wishlistUpdated");
    window.dispatchEvent(wishlistEvent);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    // Remove from wishlist after adding to cart
    removeFromWishlist(product.id);

    // Show popup notification
    setAddedToCartItem(product);

    // Hide notification after 5 seconds
    setTimeout(() => {
      setAddedToCartItem(null);
    }, 5000);
  };

  const clearWishlist = () => {
    localStorage.setItem("wishlist", JSON.stringify([]));
    setWishlistItems([]);

    // Dispatch custom event to notify other components about wishlist changes
    const wishlistEvent = new CustomEvent("wishlistUpdated");
    window.dispatchEvent(wishlistEvent);
  };

  if (isLoading) {
    return (
      <div className="container-custom mx-auto py-16 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jewelry-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-jewelry-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600">My Wishlist</span>
        </nav>

        {/* Cart Added Notification Popup */}
        {addedToCartItem && (
          <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-xs w-full border-l-4 border-jewelry-500 animate-slide-in">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <img
                  src={addedToCartItem.image}
                  alt={addedToCartItem.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">
                  Added to Cart!
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {addedToCartItem.name}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => setAddedToCartItem(null)}
                    className="text-gray-500 text-sm hover:text-gray-700"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="bg-jewelry-500 text-white text-sm py-1 px-3 rounded hover:bg-jewelry-600"
                  >
                    Go to Cart
                  </button>
                </div>
              </div>
              <button
                onClick={() => setAddedToCartItem(null)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-jewelry-800">
              My Wishlist
            </h1>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm text-gray-500 hover:text-jewelry-600 transition-colors"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl text-gray-300 mb-4">
                <i className="far fa-heart"></i>
              </div>
              <h2 className="text-2xl font-medium text-gray-600 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 mb-8">
                Add items you love to your wishlist. Review them anytime and
                easily move them to your cart.
              </p>
              <Link
                to="/products"
                className="inline-block bg-jewelry-600 text-white py-3 px-6 rounded-md hover:bg-jewelry-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative">
                      <Link to={`/product/${product.id}`} className="block">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-3 right-3 bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-transform hover:scale-110"
                        aria-label="Remove from wishlist"
                      >
                        <i className="fas fa-times text-gray-400 hover:text-red-500"></i>
                      </button>
                    </div>

                    <div className="p-4">
                      <Link to={`/product/${product.id}`} className="block">
                        <h3 className="font-serif text-lg font-medium text-gray-800 mb-1 hover:text-jewelry-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-jewelry-600 font-bold mb-4">
                        ₹{product.price.toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2 px-4 bg-jewelry-600 text-white rounded-md hover:bg-jewelry-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  to="/products"
                  className="inline-block bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
