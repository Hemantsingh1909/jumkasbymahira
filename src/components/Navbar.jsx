'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams ? searchParams.get('filter') || '' : '';

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
      <div className="ticker-container relative flex overflow-x-hidden bg-jewelry-900 text-white py-2.5 text-xs font-medium tracking-wide">
        <div className="animate-ticker flex whitespace-nowrap shrink-0 gap-32 px-16">
          <span>✨ Handcrafted in India</span>
          <span>🚚 Free Shipping Above ₹1499</span>
          <span>🔒 Secure Payments</span>
          <span>↩ Easy Returns</span>
        </div>
        <div className="animate-ticker flex whitespace-nowrap shrink-0 gap-32 px-16" aria-hidden="true">
          <span>✨ Handcrafted in India</span>
          <span>🚚 Free Shipping Above ₹1499</span>
          <span>🔒 Secure Payments</span>
          <span>↩ Easy Returns</span>
        </div>
      </div>
      <nav
        className={`${
          isScrolled
            ? "bg-white/95 shadow-md backdrop-blur-md py-2.5"
            : "bg-[#FAF6F0] py-3.5"
        } text-gray-800 px-4 sticky top-0 z-50 transition-all duration-300 border-b border-gray-100/50`}
      >
        <div className="w-full px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <div className="text-jewelry-800 font-display">
                <span className="text-2xl font-bold">Jhumkas</span>
                <span className="text-xl text-jewelry-600 italic ml-1">
                  by Malti
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center space-x-12 xl:space-x-16 mx-auto">
              <Link
                href="/products"
                className={`text-[16px] lg:text-[17px] font-medium transition-colors font-sans tracking-wide pb-1 border-b-2 ${
                  pathname === "/products" && !filter
                    ? "text-[#E6455F] border-[#D2AD7B]"
                    : "text-gray-700 border-transparent hover:text-jewelry-600"
                }`}
              >
                Products
              </Link>
              <Link
                href="/products?filter=best-sellers"
                className={`text-[16px] lg:text-[17px] font-medium transition-colors font-sans tracking-wide pb-1 border-b-2 ${
                  pathname === "/products" && filter === "best-sellers"
                    ? "text-[#E6455F] border-[#D2AD7B]"
                    : "text-gray-700 border-transparent hover:text-jewelry-600"
                }`}
              >
                Best Sellers
              </Link>
              <Link
                href="/products?filter=new-arrivals"
                className={`text-[16px] lg:text-[17px] font-medium transition-colors font-sans tracking-wide pb-1 border-b-2 ${
                  pathname === "/products" && filter === "new-arrivals"
                    ? "text-[#E6455F] border-[#D2AD7B]"
                    : "text-gray-700 border-transparent hover:text-jewelry-600"
                }`}
              >
                New Arrivals
              </Link>
              <Link
                href="/about"
                className={`text-[16px] lg:text-[17px] font-medium transition-colors font-sans tracking-wide pb-1 border-b-2 ${
                  pathname === "/about"
                    ? "text-[#E6455F] border-[#D2AD7B]"
                    : "text-gray-700 border-transparent hover:text-jewelry-600"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`text-[16px] lg:text-[17px] font-medium transition-colors font-sans tracking-wide pb-1 border-b-2 ${
                  pathname === "/contact"
                    ? "text-[#E6455F] border-[#D2AD7B]"
                    : "text-gray-700 border-transparent hover:text-jewelry-600"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Desktop Right Group: Search Bar & Actions */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {/* Desktop Search Bar */}
              <div className="flex-grow max-w-[260px] xl:max-w-[320px]">
                <form onSubmit={handleSearch} className="relative">
                  <button
                    type="submit"
                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#D2AD7B] hover:text-jewelry-800"
                    aria-label="Search"
                  >
                    <i className="fas fa-search text-sm"></i>
                  </button>
                  <input
                    type="text"
                    placeholder="Search handcrafted jhumkas..."
                    className="w-full py-1.5 pl-10 pr-4 rounded-full border border-[#D2AD7B] bg-transparent focus:outline-none focus:ring-1 focus:ring-[#D2AD7B] text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Icons Group */}
              <div className="flex items-center space-x-6 xl:space-x-7">
                {/* Wishlist Link */}
                <Link
                  href="/wishlist"
                  className="text-gray-700 hover:text-jewelry-600 transition-colors flex items-center justify-center group"
                  aria-label="Wishlist"
                >
                  <div className="relative">
                    <i className="far fa-heart text-xl group-hover:scale-105 transition-transform"></i>
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#E6455F] text-white text-[9px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Account Link */}
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-jewelry-600 transition-colors flex items-center justify-center group"
                  aria-label="Account"
                >
                  <i className="far fa-user text-xl group-hover:scale-105 transition-transform"></i>
                </Link>

                {/* Cart Link */}
                <Link
                  href="/cart"
                  className="text-gray-700 hover:text-jewelry-600 transition-colors flex items-center justify-center group"
                  aria-label="Shopping cart"
                >
                  <div className="relative">
                    <i className="fas fa-shopping-bag text-xl group-hover:scale-105 transition-transform"></i>
                    {totalCartItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#E6455F] text-white text-[9px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold">
                        {totalCartItems}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile Actions and Hamburger */}
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
          </div>

          {/* Mobile Menu Drawer */}
          <div
            className={`${
              isMenuOpen
                ? "max-h-screen opacity-100 visible pointer-events-auto"
                : "max-h-0 opacity-0 invisible pointer-events-none"
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
                href="/products"
                className={
                  pathname === "/products"
                    ? "flex items-center text-jewelry-900 bg-jewelry-50/70 border-l-4 border-jewelry-600 rounded-r font-semibold pl-3 py-3 transition-colors"
                    : "flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <i
                  className={`fas fa-gem mr-3 text-lg ${
                    pathname === "/products"
                      ? "text-jewelry-600"
                      : "text-jewelry-500/80"
                  }`}
                ></i>
                <span>All Products</span>
              </Link>
              <Link
                href="/products?filter=best-sellers"
                className="flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-fire mr-3 text-lg text-jewelry-500/80"></i>
                <span>Best Sellers</span>
              </Link>
              <Link
                href="/products?filter=new-arrivals"
                className="flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-bullhorn mr-3 text-lg text-jewelry-500/80"></i>
                <span>New Arrivals</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-info-circle mr-3 text-lg text-jewelry-500/80"></i>
                <span>About Us</span>
              </Link>
              <Link
                href="/contact"
                className={
                  pathname === "/contact"
                    ? "flex items-center text-jewelry-900 bg-jewelry-50/70 border-l-4 border-jewelry-600 rounded-r font-semibold pl-3 py-3 transition-colors"
                    : "flex items-center text-black lg:hover:text-jewelry-800 pl-3 py-3 lg:hover:bg-jewelry-50/50 rounded transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <i
                  className={`fas fa-envelope mr-3 text-lg ${
                    pathname === "/contact"
                      ? "text-jewelry-600"
                      : "text-jewelry-500/80"
                  }`}
                ></i>
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
