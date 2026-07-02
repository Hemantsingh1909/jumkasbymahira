'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addToCart } from '@/src/store/cartSlice';
import ProductCard from '@/src/components/ProductCard';

export default function ProductDetail({ params }) {
  const { id: productId } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isInCart = cartItems.some((item) => item.id === Number(productId));
  const cartItem = cartItems.find((item) => item.id === Number(productId));

  useEffect(() => {
    window.scrollTo(0, 0);

    const foundProduct = products.find((p) => p.id === Number(productId));

    if (foundProduct) {
      setProduct(foundProduct);

      const similar = products
        .filter(
          (p) =>
            p.id !== foundProduct.id &&
            (p.name.includes(foundProduct.name.split(' ')[0]) ||
              Math.abs(p.price - foundProduct.price) < 2000)
        )
        .slice(0, 4);

      setRelatedProducts(similar);

      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsInWishlist(wishlist.some((item) => item.id === foundProduct.id));
      setLoading(false);
    } else {
      router.push('/products');
    }
  }, [productId, products, router]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product));
      }
    }
  };

  const toggleWishlist = () => {
    if (!product) return;

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

  if (loading || !product) {
    return <div className="container-custom py-12">Loading...</div>;
  }

  return (
    <div className="bg-gray-50">
      {/* Breadcrumbs */}
      <div className="container-custom py-4">
        <nav className="flex text-sm">
          <Link href="/" className="text-gray-500 hover:text-jewelry-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-500 hover:text-jewelry-600">
            Products
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden sticky top-20">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-3xl font-display font-bold text-jewelry-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-lg"></i>
                ))}
              </div>
              <span className="text-gray-600">(48 reviews)</span>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-gray-600 text-lg mb-3">Price</p>
              <p className="text-4xl font-bold text-jewelry-600">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            {/* Stock Info */}
            <div className="mb-6">
              <p className="text-green-600 font-medium">In Stock</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="px-6 py-2">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-jewelry-600 text-white py-3 rounded font-medium hover:bg-jewelry-700 transition-colors"
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                className="flex-1 border-2 border-jewelry-600 text-jewelry-600 py-3 rounded font-medium hover:bg-jewelry-50 transition-colors"
              >
                <i className={`fas fa-heart ${isInWishlist ? 'text-red-500' : ''} mr-2`}></i>
                {isInWishlist ? 'In Wishlist' : 'Wishlist'}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-jewelry-50 p-4 rounded">
              <p className="text-sm text-gray-700">
                <i className="fas fa-truck mr-2 text-jewelry-600"></i>
                <strong>Free Shipping</strong> on orders over ₹5000
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <i className="fas fa-undo mr-2 text-jewelry-600"></i>
                <strong>7-day Returns</strong> - No questions asked
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-lg">
          <div className="flex border-b border-gray-200">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-jewelry-600 text-jewelry-600'
                    : 'text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-700">
                  Experience the elegance and grace of our {product.name}. Crafted
                  with precision and attention to detail, this exquisite piece is
                  perfect for any occasion.
                </p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Material:</strong> Premium metals and gemstones
                  </li>
                  <li>
                    <strong>Weight:</strong> Variable based on design
                  </li>
                  <li>
                    <strong>Size:</strong> Standard size for all ear types
                  </li>
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <p className="text-gray-700">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-jewelry-900 mb-6">
              Related Products
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
