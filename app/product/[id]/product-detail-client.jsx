// app/product/[id]/product-detail-client.jsx
'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '@/src/store/cartSlice';
import ProductCard from '@/src/components/ProductCard';

export default function ProductDetailClient({ product, relatedProducts }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(() => {
    if (typeof window === 'undefined') return false;
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some((item) => item.id === product.id);
  });

  const [reviews, setReviews] = useState(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(`product_reviews_${product.id}`) || '[]');
  });

  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    const updatedReviews = [newReview, ...reviews];
    localStorage.setItem(`product_reviews_${product.id}`, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);

    setNewReviewName('');
    setNewReviewRating(5);
    setNewReviewComment('');

    // Trigger cross-component sync event
    window.dispatchEvent(new CustomEvent(`reviewsUpdated_${product.id}`));
  };

  const averageRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const renderDetailStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fa-solid fa-star text-yellow-400 text-sm"></i>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<i key={i} className="fa-solid fa-star-half-stroke text-yellow-400 text-sm"></i>);
      } else {
        stars.push(<i key={i} className="fa-regular fa-star text-gray-300 text-sm"></i>);
      }
    }
    return stars;
  };

  const [activeTab, setActiveTab] = useState('description');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(null);

  const disabledSizes = product.tags
    ? product.tags.filter(t => t.startsWith('disabled-size:')).map(t => t.replace('disabled-size:', ''))
    : [];

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (product.category?.toLowerCase() === 'bangles' && !selectedSize) {
      setSizeError('Please select a size before adding to cart.');
      return;
    }
    setSizeError(null);
    dispatch(addToCart({ ...product, quantity, selectedSize }));
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (isInWishlist) {
      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
    }

    const wishlistEvent = new CustomEvent('wishlistUpdated');
    window.dispatchEvent(wishlistEvent);
  };

  // Zoom implementation
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  return (
    <div className="bg-gray-50 py-12 min-h-[calc(100vh-420px)]">
      <div className="container-custom mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-jewelry-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-500 hover:text-jewelry-600 capitalize">
            {product.category || 'Products'}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Images */}
          <div className="space-y-4">
            {/* Main Image Viewport */}
            <div 
              className="relative h-[320px] sm:h-[450px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              
              {/* Zoom Preview Overlay */}
              <div 
                className="absolute inset-0 z-30 pointer-events-none border border-gray-200/50 rounded-xl bg-no-repeat shadow-inner transition-opacity duration-150"
                style={zoomStyle}
              />
            </div>

            {/* Carousel Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden bg-white shadow-sm border-2 shrink-0 transition-all ${
                      activeImage === img ? 'border-jewelry-600 scale-[1.02]' : 'border-transparent hover:border-jewelry-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Product view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Purchase Controls */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C19A5B] font-semibold">{product.category}</span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mt-1 mb-2">
                  {product.name}
                </h1>
                
                {/* Rating summary */}
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 gap-0.5">
                    {renderDetailStars(averageRating)}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 mt-0.5">({averageRating})</span>
                  <span className="text-xs text-gray-400 mt-0.5">|</span>
                  <span className="text-xs text-gray-500 mt-0.5">{reviews.length} Customer Reviews</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-jewelry-600">
                  ₹{Number(product.price || 0).toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">Inclusive of all taxes</span>
              </div>

              <div className="prose prose-sm text-gray-600 max-w-none leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Specs overview */}
              <div className="border-t border-b border-gray-200 py-3.5 grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                <div><strong>SKU:</strong> <span className="font-mono text-xs">{product.sku}</span></div>
                <div><strong>Stock:</strong> <span className={product.stockStatus === 'In Stock' ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>{product.stockStatus}</span></div>
                <div><strong>Material:</strong> <span>{product.material}</span></div>
                <div><strong>Color:</strong> <span>{product.color}</span></div>
              </div>

              {/* Bangles Size Selection */}
              {product.category?.toLowerCase() === 'bangles' && (
                <div className="py-2.5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-700">Select Bangle Size (Diameter) *</span>
                    <Link href="/about#care-guide" className="text-xs text-[#C19A5B] hover:underline font-medium">Bangle Size Guide</Link>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {['2.4', '2.6', '2.8'].map((size) => {
                      const isDisabled = disabledSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (!isDisabled) {
                              setSelectedSize(size);
                              setSizeError(null);
                            }
                          }}
                          disabled={isDisabled}
                          className={`w-12 h-12 rounded-lg border text-sm font-bold flex items-center justify-center transition-all ${
                            isDisabled ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through' :
                            selectedSize === size ? 'border-[#5C1625] bg-[#5C1625] text-white shadow-sm scale-105' :
                            'border-gray-300 text-gray-700 hover:border-gray-450 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {sizeError && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{sizeError}</p>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              {product.stockStatus !== 'Out of Stock' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      disabled={quantity <= 1}
                    >
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="px-6 py-2 font-semibold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      disabled={quantity >= 10}
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3.5">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === 'Out of Stock'}
                  className={`w-full sm:flex-1 py-3.5 rounded-lg font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2 ${product.stockStatus === 'Out of Stock'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-jewelry-600 hover:bg-jewelry-700 hover:shadow-lg transform active:scale-95'
                    }`}
                >
                  <i className="fa-solid fa-bag-shopping text-lg"></i>
                  {product.stockStatus === 'Out of Stock' ? 'Sold Out' : 'Add to Cart'}
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`w-full sm:flex-1 py-3.5 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${isInWishlist
                      ? 'border-red-200 text-red-500 bg-red-50/50 hover:bg-red-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <i className={`text-lg ${isInWishlist ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-gray-400'}`}></i>
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Delivery Details */}
              <div className="bg-jewelry-50/50 p-4 rounded-xl border border-jewelry-100/50 space-y-2">
                <p className="text-xs text-gray-600 flex items-center gap-2">
                  <i className="fa-solid fa-truck text-jewelry-600 text-sm shrink-0"></i>
                  <span><strong>Free Delivery</strong> on orders over ₹5,000 (standard shipping: ₹99)</span>
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-jewelry-600 text-sm shrink-0"></i>
                  <span><strong>7-Day Hassle-Free Returns</strong> if not satisfied</span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Product Details Tabs (Description, Specifications, Care) */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'care', label: 'Care Instructions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 font-semibold text-sm transition-all focus:outline-none ${
                  activeTab === tab.id
                    ? 'text-jewelry-700 bg-jewelry-50/20 border-b-2 border-jewelry-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
                <p>{product.description}</p>
                <p>This handcrafted piece showcases delicate design details and represents a synthesis of modern lifestyle requirements with classic design grammar.</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-md">
                <table className="w-full text-sm text-gray-600">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="py-2.5 flex justify-between">
                      <td className="font-semibold text-gray-700">SKU Code</td>
                      <td className="font-mono text-xs">{product.sku}</td>
                    </tr>
                    <tr className="py-2.5 flex justify-between">
                      <td className="font-semibold text-gray-700">Material</td>
                      <td>{product.material}</td>
                    </tr>
                    <tr className="py-2.5 flex justify-between">
                      <td className="font-semibold text-gray-700">Base Color</td>
                      <td>{product.color}</td>
                    </tr>
                    <tr className="py-2.5 flex justify-between">
                      <td className="font-semibold text-gray-700">Occasion Recommendation</td>
                      <td>{product.occasion}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3">
                <h4 className="font-serif font-bold text-gray-800 text-md">How to care for your Jhumkas:</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Store in airtight zip bags or original box when not in use.</li>
                  <li>Avoid direct contact with perfumes, deodorants, water, and spray sanitizers.</li>
                  <li>Clean gently with a soft dry cloth after use to remove sweat/oils before storing.</li>
                  <li>Do not store along with other velvet/fabric based boxes to protect silver replica coatings.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews" className="mt-8 bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-100 pb-8">
            {/* Left Column: Rating breakdown summary */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-jewelry-800">Reviews & Ratings</h2>
              <div className="flex items-baseline gap-2.5">
                <span className="text-5xl font-extrabold text-gray-800">{averageRating}</span>
                <div className="space-y-1">
                  <div className="flex text-yellow-400 gap-0.5">
                    {renderDetailStars(averageRating)}
                  </div>
                  <p className="text-xs text-gray-400">Based on {reviews.length} reviews</p>
                </div>
              </div>

              {/* Bar breakdown */}
              <div className="space-y-2.5 pt-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter(r => r.rating === stars).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center text-xs text-gray-600 gap-2">
                      <span className="w-3 text-right">{stars}</span>
                      <i className="fa-solid fa-star text-yellow-400 text-[11px]"></i>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-jewelry-500 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-8 text-right text-gray-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Write a Review form */}
            <div className="md:col-span-2 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-lg font-serif font-semibold text-jewelry-800 mb-4">Write a Review</h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Priyanjali Sen"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Rating</label>
                    <div className="flex items-center gap-1 mt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <i
                            className={`text-xl transition-all ${
                              star <= (hoverRating || newReviewRating)
                                ? 'fa-solid fa-star text-yellow-400'
                                : 'fa-regular fa-star text-gray-300'
                            }`}
                          ></i>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Review Description</label>
                  <textarea
                    required
                    rows="3"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Share details of your experience with this jewelry (design, finish, material quality)..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-jewelry-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-jewelry-600 hover:bg-jewelry-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm shadow transition-all hover:shadow-md active:scale-95"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* List of Reviews */}
          <div className="pt-4 space-y-6">
            <h3 className="text-lg font-serif font-bold text-jewelry-800 border-b border-gray-100 pb-3">Reviews List</h3>
            {reviews.length > 0 ? (
              <div className="space-y-6 divide-y divide-gray-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{rev.name}</h4>
                        <div className="flex text-yellow-400 gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <i
                              key={s}
                              className={`text-xs ${s <= rev.rating ? 'fa-solid fa-star text-yellow-400' : 'fa-regular fa-star text-gray-300'}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{rev.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-450 italic font-sans">No reviews have been written for this product yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-jewelry-800 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
