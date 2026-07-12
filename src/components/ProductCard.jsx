'use client';

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductUrl } from "../lib/slug";
import { Heart, Star, StarHalf } from "lucide-react";

const ProductCard = ({ product, priority = false }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(() => {
    if (typeof window === 'undefined') return false;
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    return wishlist.some((item) => item.id === product.id);
  });

  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  // Check if product is already in cart
  const isInCart = cartItems.some((item) => item.id === product.id);

  const [reviewsSummary, setReviewsSummary] = useState({ rating: 0, count: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loadReviews = () => {
      const stored = JSON.parse(localStorage.getItem(`product_reviews_${product.id}`) || '[]');
      if (stored.length > 0) {
        const avg = stored.reduce((sum, r) => sum + r.rating, 0) / stored.length;
        setReviewsSummary({ rating: Math.round(avg * 10) / 10, count: stored.length });
      } else {
        setReviewsSummary({ rating: 0, count: 0 });
      }
    };
    loadReviews();

    window.addEventListener(`reviewsUpdated_${product.id}`, loadReviews);
    return () => {
      window.removeEventListener(`reviewsUpdated_${product.id}`, loadReviews);
    };
  }, [product.id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-gray-300" />);
      }
    }
    return stars;
  };

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
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <Link href={getProductUrl(product)} className="relative block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-md z-20 transition-transform hover:scale-110"
          aria-label={
            isInWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart
            className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
          />
        </button>

        {/* Added to Cart Message */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-jewelry-600 text-white text-center py-2 transition-transform duration-300 ${showAddedMessage
            ? "transform translate-y-0"
            : "transform translate-y-full"
            }`}
        >
          Added to cart!
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={getProductUrl(product)} className="block">
          <h3 className="font-serif text-lg font-medium text-gray-800 mb-1 hover:text-jewelry-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mb-3">
          <p className="text-jewelry-600 font-bold">
            ₹{Number(product.price || 0).toFixed(2)}
          </p>
          <div className="flex items-center">
            {reviewsSummary.count > 0 ? (
              <>
                <div className="flex text-yellow-400 gap-0.5">
                  {renderStars(reviewsSummary.rating)}
                </div>
                <span className="text-xs text-gray-500 ml-1">({reviewsSummary.rating})</span>
              </>
            ) : (
              <span className="text-xs text-gray-400 italic font-sans">No reviews yet</span>
            )}
          </div>
        </div>

        {product.category?.toLowerCase() === 'bangles' ? (
          <Link
            href={getProductUrl(product)}
            className="py-2 px-4 rounded-md transition-colors w-full font-medium bg-jewelry-500 text-white hover:bg-jewelry-600 block text-center shadow-sm hover:shadow"
          >
            Select Size
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`py-2 px-4 rounded-md transition-colors w-full font-medium ${isInCart
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-jewelry-500 text-white hover:bg-jewelry-600"
              }`}
          >
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </button>
        )}
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
