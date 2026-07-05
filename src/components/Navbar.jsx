'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, X, Menu, Home, Tags, Gem, Mail, Palette, Moon, Crown, Star } from 'lucide-react';

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
                <Search className="w-5 h-5" />
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
              <Heart className="w-5 h-5" />
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
              <ShoppingBag className="w-5 h-5" />
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
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
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
              <Heart className="w-[18px] h-[18px]" />
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
              <ShoppingBag className="w-[18px] h-[18px]" />
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
                <Search className="w-5 h-5" />
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
              <Home className={`mr-3 w-5 h-5 ${pathname === '/' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`} />
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
              <Tags className={`mr-3 w-5 h-5 ${pathname === '/collections' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`} />
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
              <Gem className={`mr-3 w-5 h-5 ${pathname === '/products' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`} />
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
              <Heart className={`mr-3 w-5 h-5 ${pathname === '/wishlist' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`} />
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
              <Mail className={`mr-3 w-5 h-5 ${pathname === '/contact' ? 'text-jewelry-600' : 'text-jewelry-500/80'}`} />
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
                  <Gem className="w-3.5 h-3.5 mr-2 text-jewelry-500/80" /> Jhumkas
                </Link>
                <Link
                  href="/products?category=meenakari"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Palette className="w-3.5 h-3.5 mr-2 text-jewelry-500/80" /> Meenakari
                </Link>
                <Link
                  href="/products?category=chandbali"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Moon className="w-3.5 h-3.5 mr-2 text-jewelry-500/80" /> Chandbali
                </Link>
                <Link
                  href="/products?category=bridal sets"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Crown className="w-3.5 h-3.5 mr-2 text-jewelry-500/80" /> Bridal Sets
                </Link>
                <Link
                  href="/products?category=everyday"
                  className="flex items-center text-sm text-gray-600 hover:text-jewelry-800 py-2.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Star className="w-3.5 h-3.5 mr-2 text-jewelry-500/80" /> Everyday
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
