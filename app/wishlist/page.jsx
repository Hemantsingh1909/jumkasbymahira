'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import ProductCard from '@/src/components/ProductCard';
import { addToCart } from '@/src/store/cartSlice';
import { getProductUrl } from '@/src/lib/slug';
import { Trash2, Heart } from 'lucide-react';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleWishlistUpdate = () => {
      const updated = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(updated);
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const dispatch = useDispatch();

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);

    const wishlistEvent = new CustomEvent('wishlistUpdated');
    window.dispatchEvent(wishlistEvent);
  };

  const addToCartAndRemove = (product) => {
    dispatch(addToCart(product));
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom mx-auto px-4">
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-jewelry-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600">My Wishlist</span>
        </nav>

        <h1 className="text-3xl font-serif font-bold mb-8 text-center text-jewelry-800">
          My Wishlist
        </h1>

        {wishlistItems.length > 0 ? (
          <div>
            <p className="text-gray-600 mb-6">
              You have {wishlistItems.length} item(s) in your wishlist
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <div className="mt-3 flex gap-2">
                    {product.category?.toLowerCase() === 'bangles' ? (
                      <Link
                        href={getProductUrl(product)}
                        className="flex-1 bg-jewelry-600 text-white py-2 px-4 rounded text-sm hover:bg-jewelry-700 transition-colors text-center block font-medium"
                      >
                        Select Size
                      </Link>
                    ) : (
                      <button
                        onClick={() => addToCartAndRemove(product)}
                        className="flex-1 bg-jewelry-600 text-white py-2 px-4 rounded text-sm hover:bg-jewelry-700 transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    )}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">Your wishlist is empty</p>
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
