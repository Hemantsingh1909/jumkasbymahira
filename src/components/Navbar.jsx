'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

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
    <>
      {/* Announcement Bar */}
      <div className="ticker-container relative flex overflow-x-hidden bg-jewelry-900 text-white py-2 text-xs font-medium tracking-wide">
        <div className="animate-ticker flex whitespace-nowrap shrink-0 gap-16 px-8">
          <span>✨ Handcrafted in India</span>
          <span className="text-white/40">|</span>
          <span>🚚 Free Shipping Above ₹1499</span>
          <span className="text-white/40">|</span>
          <span>💎 Premium Quality</span>
          <span className="text-white/40">|</span>
          <span>🔒 Secure Payments</span>
          <span className="text-white/40">|</span>
        </div>
        <div className="animate-ticker flex whitespace-nowrap shrink-0 gap-16 px-8" aria-hidden="true">
          <span>✨ Handcrafted in India</span>
          <span className="text-white/40">|</span>
          <span>🚚 Free Shipping Above ₹1499</span>
          <span className="text-white/40">|</span>
          <span>💎 Premium Quality</span>
          <span className="text-white/40">|</span>
          <span>🔒 Secure Payments</span>
          <span className="text-white/40">|</span>
        </div>
      </div>
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
                aria-label="Search"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <Link
              href="/wishlist"
              className="mr-4 text-jewelry-800 relative"
              aria-label="Wishlist"
            >
              <i className="far fa-heart text-lg"></i>
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
              <i className="fas fa-shopping-bag text-lg"></i>
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-jewelry-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>
            <button
              className="text-jewelry-800 focus:outline-none flex items-center justify-center"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <i className="fas fa-times text-xl"></i>
              ) : (
                <i className="fas fa-bars text-xl"></i>
              )}
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
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
              className="text-jewelry-800 hover:text-jewelry-600 transition-colors relative flex items-center justify-center"
              aria-label="Wishlist"
            >
              <i className="far fa-heart text-[17px]"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="text-jewelry-800 hover:text-jewelry-600 transition-colors relative flex items-center justify-center"
              aria-label="Shopping cart"
            >
              <i className="fas fa-shopping-bag text-[17px]"></i>
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
          } lg:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        >
          {/* Search Bar - Mobile */}
          <div className="mt-4 mb-3 md:hidden">
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
                aria-label="Search"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          <div className="flex flex-col space-y-1.5 py-2">
            <Link
              href="/"
              className={pathname === '/' 
                ? "flex items-center text-jewelry-900 bg-jewelry-50/70 border-l-4 border-jewelry-600 rounded-r font-semibold pl-3 py-3 transition-colors" 
                : "flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <i className={`fas fa-home mr-3 text-lg ${pathname === '/' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`}></i>
              <span>Home</span>
            </Link>
            <Link
              href="/collections"
              className={pathname === '/collections' 
                ? "flex items-center text-jewelry-900 bg-jewelry-50/70 border-l-4 border-jewelry-600 rounded-r font-semibold pl-3 py-3 transition-colors" 
                : "flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <i className={`fas fa-tags mr-3 text-lg ${pathname === '/collections' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`}></i>
              <span>Collections</span>
            </Link>
            <Link
              href="/products"
              className={pathname === '/products' 
                ? "flex items-center text-jewelry-900 bg-jewelry-50/70 border-l-4 border-jewelry-600 rounded-r font-semibold pl-3 py-3 transition-colors" 
                : "flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <i className={`fas fa-gem mr-3 text-lg ${pathname === '/products' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`}></i>
              <span>All Products</span>
            </Link>
            <Link
              href="/wishlist"
              className={pathname === '/wishlist' 
                ? "flex items-center text-jewelry-900 bg-jewelry-50/70 border-l-4 border-jewelry-600 rounded-r font-semibold pl-3 py-3 transition-colors" 
                : "flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <i className={`far fa-heart mr-3 text-lg ${pathname === '/wishlist' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`}></i>
              <span>Wishlist</span>
            </Link>
            <Link
              href="/contact"
              className={pathname === '/contact' 
                ? "flex items-center text-jewelry-900 bg-jewelry-50/70 border-l-4 border-jewelry-600 rounded-r font-semibold pl-3 py-3 transition-colors" 
                : "flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <i className={`fas fa-envelope mr-3 text-lg ${pathname === '/contact' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`}></i>
              <span>Contact</span>
            </Link>

            {/* Quick Category Shortcuts */}
            <div className="border-t border-gray-100 pt-3 mt-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Shop Categories</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 px-3">
                <Link
                  href="/products?category=jhumkas"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-gem mr-2 text-xs text-jewelry-500/80"></i> Jhumkas
                </Link>
                <Link
                  href="/products?category=meenakari"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-palette mr-2 text-xs text-jewelry-500/80"></i> Meenakari
                </Link>
                <Link
                  href="/products?category=chandbali"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-moon mr-2 text-xs text-jewelry-500/80"></i> Chandbali
                </Link>
                <Link
                  href="/products?category=bridal-sets"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-crown mr-2 text-xs text-jewelry-500/80"></i> Bridal Sets
                </Link>
                <Link
                  href="/products?category=everyday"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-star mr-2 text-xs text-jewelry-500/80"></i> Everyday
                </Link>
                <Link
                  href="/products?category=bangles"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-circle-notch mr-2 text-xs text-jewelry-500/80"></i> Bangles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
