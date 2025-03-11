// src/components/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa";
import logo from "../assets/logo.png"; // Import the logo

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed with email:", email);
      setSubscribed(true);
      setEmail("");
      // In a real app, you would send this to your backend
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Jhumkas by Mahira"
                className="h-20 object-contain bg-white rounded-lg p-2"
              />
            </Link>
            <p className="text-gray-400 mt-4">
              Exquisite jhumkas for every occasion, crafted with love and
              tradition.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-jewelry-400 transition-colors"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-jewelry-400 transition-colors"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-jewelry-400 transition-colors"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-jewelry-400 transition-colors"
              >
                <FaPinterest size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-jewelry-400 transition-colors"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-jewelry-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  className="text-gray-400 hover:text-jewelry-300 transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-jewelry-300 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-jewelry-300 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-4 text-white">
              Contact Us
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>
                  123 Jewelry Lane, Fashion District
                  <br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📱</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <span>info@jhumkasbymahira.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-4 text-white">
              Join Our Newsletter
            </h4>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            {subscribed ? (
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-jewelry-300 text-sm">
                  Thank you for subscribing! You'll receive our updates soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="bg-gray-800 text-white px-4 py-2 rounded-l w-full focus:outline-none focus:ring-1 focus:ring-jewelry-400"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-jewelry-500 hover:bg-jewelry-600 text-white px-4 py-2 rounded-r transition-colors"
                  >
                    Join
                  </button>
                </div>
                <p className="text-gray-500 text-xs">
                  By subscribing, you agree to our Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Jhumkas by Mahira. All rights
            reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-jewelry-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-jewelry-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-jewelry-300 transition-colors">
              Shipping Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
