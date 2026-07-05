'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { addToCart } from '@/src/store/cartSlice';
import ProductCard from '@/src/components/ProductCard';
import { Star, Minus, Plus, ShoppingBag, Heart, Truck, History } from 'lucide-react';

export default function ProductDetailClient({ product, relatedProducts }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Load wishlist status
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.some((item) => item.id === product.id));
    setActiveImage(product.images?.[0] || product.image);
  }, [product]);

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
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
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain p-4"
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
                    className={`w-20 h-20 border rounded-md p-1 overflow-hidden bg-white transition-all flex-shrink-0 ${
                      activeImage === imgUrl ? 'border-jewelry-600 ring-2 ring-jewelry-100' : 'border-gray-200 hover:border-jewelry-300'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
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
                <div className="flex text-yellow-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">(15 verified reviews)</span>
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
                  <span className={`font-semibold ${
                    product.stockStatus === 'In Stock' ? 'text-green-600' :
                    product.stockStatus === 'Low Stock' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {product.stockStatus}
                  </span>
                </div>
              </div>

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
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === 'Out of Stock'}
                  className={`flex-1 py-3.5 rounded-lg font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    product.stockStatus === 'Out of Stock'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-jewelry-600 hover:bg-jewelry-700 hover:shadow-lg transform active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {product.stockStatus === 'Out of Stock' ? 'Sold Out' : 'Add to Cart'}
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`px-6 py-3.5 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                    isInWishlist
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
                className={`px-6 py-4 font-semibold text-sm transition-all relative ${
                  activeTab === tab.id
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
                  <tr>
                    <td className="py-2.5 font-semibold text-gray-500">Tags</td>
                    <td className="py-2.5 text-gray-700 capitalize">{product.tags?.join(', ') || 'Traditional, Elegant'}</td>
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
