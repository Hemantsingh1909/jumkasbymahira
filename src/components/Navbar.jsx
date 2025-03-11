// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

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
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
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
          <Link to="/" className="flex items-center">
            <div className="text-jewelry-800 font-display">
              <span className="text-2xl font-bold">Jhumkas</span>
              <span className="text-xl text-jewelry-600 italic ml-1">
                by Mahira
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
              to="/wishlist"
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
              to="/cart"
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
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-b-2 border-jewelry-500 pb-1"
                  : "text-gray-700 hover:text-jewelry-600 transition-colors"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-b-2 border-jewelry-500 pb-1"
                  : "text-gray-700 hover:text-jewelry-600 transition-colors"
              }
            >
              Collections
            </NavLink>
            <NavLink
              to="/state-collections"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-b-2 border-jewelry-500 pb-1"
                  : "text-gray-700 hover:text-jewelry-600 transition-colors"
              }
            >
              State Jhumkas
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-b-2 border-jewelry-500 pb-1"
                  : "text-gray-700 hover:text-jewelry-600 transition-colors"
              }
            >
              All Products
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-b-2 border-jewelry-500 pb-1"
                  : "text-gray-700 hover:text-jewelry-600 transition-colors"
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/wishlist"
              className="text-jewelry-800 hover:text-jewelry-600 transition-colors relative"
              aria-label="Wishlist"
            >
              <i className="fas fa-heart text-xl"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/cart"
              className="text-jewelry-800 hover:text-jewelry-600 transition-colors relative"
              aria-label="Shopping cart"
            >
              <i className="fas fa-shopping-bag text-xl"></i>
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-jewelry-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        {/* Mobile Menu - Collapsible */}
        <div
          className={`${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
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
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-l-4 border-jewelry-500 pl-3 py-2"
                  : "text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-l-4 border-jewelry-500 pl-3 py-2"
                  : "text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </NavLink>
            <NavLink
              to="/state-collections"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-l-4 border-jewelry-500 pl-3 py-2"
                  : "text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              State Jhumkas
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-l-4 border-jewelry-500 pl-3 py-2"
                  : "text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </NavLink>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-l-4 border-jewelry-500 pl-3 py-2"
                  : "text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-l-4 border-jewelry-500 pl-3 py-2"
                  : "text-gray-700 hover:text-jewelry-600 pl-3 py-2 hover:bg-jewelry-50 rounded"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "text-jewelry-700 font-semibold border-l-4 border-jewelry-500 pl-3 py-2 flex items-center"
                  : "text-gray-700 hover:text-jewelry-600 pl-3 py-2 flex items-center hover:bg-jewelry-50 rounded"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-shopping-bag mr-2"></i> Cart
              {totalCartItems > 0 && (
                <span className="ml-2 bg-jewelry-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
