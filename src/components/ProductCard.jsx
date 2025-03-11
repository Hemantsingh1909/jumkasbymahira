import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  // Check if product is already in cart
  const isInCart = cartItems.some((item) => item.id === product.id);

  // Load wishlist from localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsInWishlist(wishlist.some((item) => item.id === product.id));
  }, [product.id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setShowAddedMessage(true);

    // Hide message after 2 seconds
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2000);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsInWishlist(true);
    }

    // Dispatch custom event to notify other components about wishlist changes
    // Using a more compatible approach for cross-browser support
    const wishlistEvent = new CustomEvent("wishlistUpdated");
    window.dispatchEvent(wishlistEvent);
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="relative h-64 overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-md z-20 transition-transform hover:scale-110"
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <i
              className={`fas fa-heart ${
                isInWishlist ? "text-red-500" : "text-gray-400"
              }`}
            ></i>
          </button>

          {/* Quick Add Button - Visible on Hover */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="bg-white text-jewelry-600 py-2 px-4 rounded-md hover:bg-jewelry-50 transition-colors transform hover:scale-105 font-medium"
              disabled={isInCart}
            >
              {isInCart ? "Added to Cart" : "Quick Add"}
            </button>
          </div>

          {/* Added to Cart Message */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-jewelry-600 text-white text-center py-2 transition-transform duration-300 ${
              showAddedMessage
                ? "transform translate-y-0"
                : "transform translate-y-full"
            }`}
          >
            Added to cart!
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-serif text-lg font-medium text-gray-800 mb-1 hover:text-jewelry-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mb-3">
          <p className="text-jewelry-600 font-bold">
            ₹{product.price.toFixed(2)}
          </p>
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              <i className="fas fa-star text-sm"></i>
              <i className="fas fa-star text-sm"></i>
              <i className="fas fa-star text-sm"></i>
              <i className="fas fa-star text-sm"></i>
              <i className="fas fa-star-half-alt text-sm"></i>
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`py-2 px-4 rounded-md transition-colors w-full font-medium ${
            isInCart
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-jewelry-500 text-white hover:bg-jewelry-600"
          }`}
        >
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }).isRequired,
};

export default ProductCard;
