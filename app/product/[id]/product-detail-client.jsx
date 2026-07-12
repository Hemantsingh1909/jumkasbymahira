'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '@/src/store/cartSlice';
import ProductCard from '@/src/components/ProductCard';
import { Star, StarHalf, Minus, Plus, ShoppingBag, Heart, Truck, History } from 'lucide-react';

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
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
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
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({ ...product, selectedSize }));
    }
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updated;
    if (isInWishlist) {
      updated = wishlist.filter((item) => item.id !== product.id);
      setIsInWishlist(false);
    } else {
      wishlist.push(product);
      updated = wishlist;
      setIsInWishlist(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  // Zoom feature handlers
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

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <div className="bg-gray-50 pb-12">
      {/* Breadcrumbs */}
      <div className="container-custom py-4">
        <nav className="flex text-sm">
          <Link href="/" className="text-gray-500 hover:text-jewelry-600 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-500 hover:text-jewelry-600 transition-colors">
            Products
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600 capitalize font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Product Information Grid */}
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm p-6 md:p-8">

          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Zoomable Image */}
            <div
              className="relative h-96 md:h-[480px] bg-gray-50 border border-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
              />

              {/* Zoom overlay window */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-200 border border-gray-200 shadow-inner rounded-lg"
                style={zoomStyle}
              />
            </div>

            {/* Thumbnail Selection */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {productImages.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-20 border rounded-md p-1 overflow-hidden bg-white transition-all flex-shrink-0 ${activeImage === imgUrl ? 'border-jewelry-600 ring-2 ring-jewelry-100' : 'border-gray-200 hover:border-jewelry-300'
                      }`}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${index + 1}`} fill sizes="80px" className="object-cover p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-jewelry-600 font-bold uppercase tracking-wider bg-jewelry-50 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-jewelry-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                {reviews.length > 0 ? (
                  <>
                    <div className="flex text-yellow-400 gap-0.5">
                      {renderDetailStars(averageRating)}
                    </div>
                    <span className="text-xs text-gray-500">({averageRating} rating from {reviews.length} reviews)</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic">No reviews yet</span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 py-4 border-y border-gray-100">
                <p className="text-4xl font-bold text-jewelry-600">₹{product.price.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400 mt-1">Inclusive of all local taxes</p>
              </div>

              {/* Product Attributes List */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-400">Material:</span> <span className="font-medium text-gray-700">{product.material}</span>
                </div>
                <div>
                  <span className="text-gray-400">Color:</span> <span className="font-medium text-gray-700">{product.color}</span>
                </div>
                <div>
                  <span className="text-gray-400">Occasion:</span> <span className="font-medium text-gray-700">{product.occasion}</span>
                </div>
                <div>
                  <span className="text-gray-400">Stock Availability:</span>{' '}
                  <span className={`font-semibold ${product.stockStatus === 'In Stock' ? 'text-green-600' :
                      product.stockStatus === 'Low Stock' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                    {product.stockStatus}
                  </span>
                </div>
              </div>
              
              {/* Size Selector for Bangles */}
              {product.stockStatus !== 'Out of Stock' && product.category?.toLowerCase() === 'bangles' && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Select Size <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-400 font-medium">(Required)</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {['2.4', '2.6', '2.8', '2.10'].map((size) => {
                      const isDisabled = disabledSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => {
                            if (!isDisabled) {
                              setSelectedSize(size);
                              setSizeError(null);
                            }
                          }}
                          className={`min-w-[3.5rem] h-10 px-3 rounded-lg border text-sm font-bold transition-all flex items-center justify-center relative ${
                            isDisabled
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through opacity-50'
                              : selectedSize === size
                              ? 'border-jewelry-600 bg-jewelry-50 text-jewelry-800 ring-2 ring-jewelry-100'
                              : 'border-gray-200 text-gray-700 hover:border-jewelry-300 hover:bg-gray-50'
                          }`}
                          title={isDisabled ? `Size ${size} is currently out of stock` : `Select size ${size}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {sizeError && (
                    <p className="text-red-600 text-xs font-semibold mt-2">{sizeError}</p>
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
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-6 py-2 font-semibold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      disabled={quantity >= 10}
                    >
                      <Plus className="w-3.5 h-3.5" />
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
                  <ShoppingBag className="w-5 h-5" />
                  {product.stockStatus === 'Out of Stock' ? 'Sold Out' : 'Add to Cart'}
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`w-full sm:flex-1 py-3.5 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${isInWishlist
                      ? 'border-red-200 text-red-500 bg-red-50/50 hover:bg-red-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Delivery Details */}
              <div className="bg-jewelry-50/50 p-4 rounded-xl border border-jewelry-100/50 space-y-2">
                <p className="text-xs text-gray-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-jewelry-600 shrink-0" />
                  <span><strong>Free Delivery</strong> on orders over ₹5,000 (standard shipping: ₹99)</span>
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-2">
                  <History className="w-4 h-4 text-jewelry-600 shrink-0" />
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
                className={`px-6 py-4 font-semibold text-sm transition-all relative ${activeTab === tab.id
                    ? 'text-jewelry-600 border-b-2 border-jewelry-600'
                    : 'text-gray-500 hover:text-jewelry-500'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 text-sm text-gray-600 leading-relaxed space-y-4">
            {activeTab === 'description' && (
              <div>
                <p>{product.description}</p>
                <p className="mt-2 text-gray-500">
                  Indulge in ethnic luxury with Jhumkas by Malti. Each pair is meticulously handcrafted to celebrate the rich cultural heritage and timeless elegance of Indian jewelry.
                </p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-semibold text-gray-500 w-1/3">SKU</td>
                    <td className="py-2.5 text-gray-700">{product.sku}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-semibold text-gray-500">Material</td>
                    <td className="py-2.5 text-gray-700">{product.material}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-semibold text-gray-500">Primary Color</td>
                    <td className="py-2.5 text-gray-700">{product.color}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-semibold text-gray-500">Occasion</td>
                    <td className="py-2.5 text-gray-700">{product.occasion}</td>
                  </tr>
                   {product.category?.toLowerCase() === 'bangles' && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 font-semibold text-gray-500">Available Sizes</td>
                      <td className="py-2.5 text-gray-700">
                        {['2.4', '2.6', '2.8', '2.10']
                          .filter(size => !disabledSizes.includes(size))
                          .join(', ') || 'None available'}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2.5 font-semibold text-gray-500">Tags</td>
                    <td className="py-2.5 text-gray-700 capitalize">
                      {product.tags
                        ?.filter(t => !t.startsWith('disabled-size:'))
                        .join(', ') || 'Traditional, Elegant'}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            {activeTab === 'care' && (
              <div className="space-y-2">
                <p className="font-semibold text-jewelry-700">How to care for your jewelry:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Keep dry and store in a moisture-free pouch/air-tight container.</li>
                  <li>Avoid contact with perfumes, hairspray, lotions, or harsh cleaning chemicals.</li>
                  <li>Clean gently with a dry, soft cloth after every wear to preserve shine.</li>
                  <li>Do not submerge in water or wear during showers/swimming.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-8">
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-2xl font-serif font-bold text-jewelry-900">Customer Reviews</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Rating summary breakdown */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-jewelry-800">{averageRating > 0 ? averageRating : '0.0'}</span>
                <span className="text-gray-400 text-sm">out of 5</span>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-400">
                {renderDetailStars(averageRating)}
                <span className="text-xs text-gray-500 ml-1">({reviews.length} reviews)</span>
              </div>

              {/* Bar breakdown */}
              <div className="space-y-2.5 pt-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter(r => r.rating === stars).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center text-xs text-gray-600 gap-2">
                      <span className="w-3 text-right">{stars}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
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
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoverRating || newReviewRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
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
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                            />
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
                <p className="text-gray-400 font-medium text-sm">No reviews yet. Be the first to share your thoughts on this piece!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-bold text-jewelry-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
