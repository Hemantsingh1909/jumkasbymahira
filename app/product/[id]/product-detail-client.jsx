// app/product/[id]/product-detail-client.jsx
'use client';

import { useState, useEffect } from 'react';
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

  // New review states for size chart and images upload/lightbox
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [activeReviewImage, setActiveReviewImage] = useState(null);
  const [imageError, setImageError] = useState(null);

  // Lock scrolling when modals are open
  const isOverlayOpen = isSizeChartOpen || !!activeReviewImage;
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOverlayOpen]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      setImageError('You can upload a maximum of 5 images for a review.');
      return;
    }

    setImageError(null);

    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = (err) => {
          reject(err);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Images) => {
        setUploadedImages((prev) => [...prev, ...base64Images].slice(0, 5));
      })
      .catch((err) => {
        console.error('Error reading images:', err);
        setImageError('Failed to read some images. Please try again.');
      });
  };

  const removeUploadedImage = (indexToRemove) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImageError(null);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      images: uploadedImages,
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
    setUploadedImages([]);
    setImageError(null);

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
                    <button
                      type="button"
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-xs text-[#C19A5B] hover:underline font-medium focus:outline-none"
                    >
                      Bangle Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {['2.4', '2.6', '2.8', '2.10'].map((size) => {
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

                {/* Image Upload for Reviews */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">
                    Upload Images (Maximum 5)
                  </label>
                  
                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Add Image Button */}
                    {uploadedImages.length < 5 && (
                      <label className="w-16 h-16 rounded-lg border border-dashed border-gray-300 hover:border-jewelry-500 cursor-pointer flex flex-col items-center justify-center bg-white transition-colors">
                        <i className="fa-solid fa-camera text-gray-400 hover:text-jewelry-500"></i>
                        <span className="text-[10px] text-gray-400 mt-1">Add</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="review-image-input"
                        />
                      </label>
                    )}
                    
                    {/* Image Previews */}
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative w-16 h-16 group rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors focus:outline-none"
                        >
                          <i className="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  {imageError && (
                    <p className="text-red-500 text-xs font-semibold">{imageError}</p>
                  )}
                  <p className="text-[11px] text-gray-455">
                    Upload up to 5 photos showing the details of the product (JPEG, PNG, WebP).
                  </p>
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
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 pt-1.5">
                        {rev.images.map((img, imgIndex) => (
                          <div 
                            key={imgIndex} 
                            onClick={() => setActiveReviewImage(img)}
                            className="w-20 h-20 rounded-lg overflow-hidden border border-gray-150 cursor-zoom-in hover:opacity-90 hover:border-jewelry-300 shadow-sm transition-all hover:scale-[1.02] bg-gray-50"
                          >
                            <img src={img} alt={`Review photo ${imgIndex + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
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

      {/* Bangle Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#FAF6F0] w-full max-w-2xl rounded-2xl shadow-2xl border border-jewelry-100 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#992E3F] text-white flex justify-between items-center border-b border-[#7D2534]">
              <h3 className="font-display text-xl font-bold tracking-wide">Bangle Size Guide</h3>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus:outline-none"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Introduction */}
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Bangles are sized by their inner diameter in inches. For instance, a size 2.6 bangle has an inner diameter of 2 and 6/16th inches (or 2.375"). Use the reference table and measurement methods below to find your perfect fit.
                </p>
              </div>

              {/* Size Table */}
              <div className="overflow-x-auto rounded-xl border border-jewelry-100 bg-white">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-jewelry-50/50 text-jewelry-900 border-b border-jewelry-100">
                      <th className="p-3.5 font-bold font-serif">Bangle Size</th>
                      <th className="p-3.5 font-bold font-serif">Inner Diameter (Inches)</th>
                      <th className="p-3.5 font-bold font-serif">Inner Diameter (mm)</th>
                      <th className="p-3.5 font-bold font-serif">Inner Circumference (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-jewelry-50">
                    <tr className="hover:bg-jewelry-50/20 transition-colors">
                      <td className="p-3.5 font-bold text-jewelry-800">2.4</td>
                      <td className="p-3.5 text-gray-700">2.25" (2 & 4/16")</td>
                      <td className="p-3.5 text-gray-700">57.2 mm</td>
                      <td className="p-3.5 text-gray-700">179.4 mm</td>
                    </tr>
                    <tr className="hover:bg-jewelry-50/20 transition-colors">
                      <td className="p-3.5 font-bold text-jewelry-800">2.6</td>
                      <td className="p-3.5 text-gray-700">2.375" (2 & 6/16")</td>
                      <td className="p-3.5 text-gray-700">60.3 mm</td>
                      <td className="p-3.5 text-gray-700">189.4 mm</td>
                    </tr>
                    <tr className="hover:bg-jewelry-50/20 transition-colors">
                      <td className="p-3.5 font-bold text-jewelry-800">2.8</td>
                      <td className="p-3.5 text-gray-700">2.5" (2 & 8/16")</td>
                      <td className="p-3.5 text-gray-700">63.5 mm</td>
                      <td className="p-3.5 text-gray-700">199.4 mm</td>
                    </tr>
                    <tr className="hover:bg-jewelry-50/20 transition-colors">
                      <td className="p-3.5 font-bold text-jewelry-800">2.10</td>
                      <td className="p-3.5 text-gray-700">2.625" (2 & 10/16")</td>
                      <td className="p-3.5 text-gray-700">66.7 mm</td>
                      <td className="p-3.5 text-gray-700">209.4 mm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* How to Measure Section */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif font-bold text-[#992E3F] text-base border-b border-jewelry-100 pb-2">How to Measure Your Bangle Size</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-jewelry-100/50 space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-jewelry-100 text-jewelry-800">Method A: Measure an Existing Bangle</span>
                    <p className="text-xs text-gray-650 leading-relaxed">
                      1. Take a bangle that fits you perfectly.<br />
                      2. Lay it flat on a ruler and measure the <strong>inner diameter</strong> (distance across the inner edges at the widest point) in inches.<br />
                      3. Match this measurement with our chart to find your size (e.g. 2.625 inches matches size 2.10).
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-jewelry-100/50 space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-jewelry-100 text-jewelry-800">Method B: Measure Your Hand Circumference</span>
                    <p className="text-xs text-gray-650 leading-relaxed">
                      1. Bring your thumb and little finger together as if putting on a bangle.<br />
                      2. Wrap a thread or soft tape measure around the widest part of your hand (the knuckles).<br />
                      3. Mark the point and measure the length on a ruler to get the circumference in mm.<br />
                      4. Compare with the circumference column in the chart (e.g. 209.4 mm matches size 2.10).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex justify-end gap-3">
              <Link
                href="/about#care-guide"
                onClick={() => setIsSizeChartOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#992E3F] hover:underline flex items-center gap-1.5"
              >
                View Full Care & Size Guide <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="bg-jewelry-800 hover:bg-jewelry-900 text-white font-semibold px-5 py-2 rounded-lg text-xs shadow-sm focus:outline-none"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Image Lightbox Modal */}
      {activeReviewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveReviewImage(null)}
        >
          <button
            onClick={() => setActiveReviewImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Close image lightbox"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          
          <div 
            className="relative max-w-full max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeReviewImage}
              alt="Review image expanded"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
