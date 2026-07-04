'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const router = useRouter();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Get wishlist count from localStorage
  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    };

    // Update count on mount
    updateWishlistCount();

    // Listen for storage events to update count when wishlist changes from other tabs
    window.addEventListener("storage", updateWishlistCount);

    // Custom event for wishlist updates within the same window
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav
      className={`${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-gradient-to-r from-jewelry-50 to-jewelry-100 py-3"
      } text-gray-800 px-4 sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="container-custom mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-jewelry-800 font-display">
              <span className="text-2xl font-bold">Jhumkas</span>
              <span className="text-xl text-jewelry-600 italic ml-1">
                by Malti
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for jhumkas..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jewelry-400 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-jewelry-600 hover:text-jewelry-800"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Link
              href="/wishlist"
              className="mr-4 text-jewelry-800 relative"
              aria-label="Wishlist"
            >
              <i className="fas fa-heart text-xl"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="mr-4 text-jewelry-800 relative"
              aria-label="Shopping cart"
            >
              <i className="fas fa-shopping-bag text-xl"></i>
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-jewelry-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>
            <button
              className="text-jewelry-800 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <i
                className={`fas ${
                  isMenuOpen ? "fa-times" : "fa-bars"
                } text-2xl`}
              ></i>
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-jewelry-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/collections"
              className="text-gray-700 hover:text-jewelry-600 transition-colors"
            >
              Collections
            </Link>

            <Link
              href="/products"
              className="text-gray-700 hover:text-jewelry-600 transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-jewelry-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/wishlist"
              className="text-jewelry-800 hover:text-jewelry-600 transition-colors relative"
              aria-label="Wishlist"
            >
              <i className="fas fa-heart text-lg"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="text-jewelry-800 hover:text-jewelry-600 transition-colors relative"
              aria-label="Shopping cart"
            >
              <i className="fas fa-shopping-bag text-lg"></i>
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-jewelry-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div
          className={`${
            isMenuOpen ? "max-h-screen opacity-100 visible pointer-events-auto" : "max-h-0 opacity-0 invisible pointer-events-none"
          } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        >
          {/* Search Bar - Mobile */}
          <div className="mt-4 mb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for jhumkas..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jewelry-400 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-jewelry-600 hover:text-jewelry-800"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          <div className="flex flex-col space-y-3 py-3">
            <Link
              href="/"
              className="text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/collections"
              className="text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>

            <Link
              href="/products"
              className="text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              href="/wishlist"
              className="text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
