// src/components/Footer.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Instagram } from 'lucide-react';
import logo from '../assets/Logo.png'; // Import the logo with correct capitalization

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          setSubscribed(true);
          setEmail("");
        }
      } catch (error) {
        console.error("Subscription error:", error);
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-3">
            <Link href="/" className="inline-block">
              <img
                src={logo?.src || logo}
                alt="Jhumkas by Malti"
                className="h-20 object-contain bg-white rounded-lg p-2"
              />
            </Link>
            <p className="text-gray-400 mt-4">
              Exquisite jhumkas for every occasion, crafted with love and
              tradition.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.instagram.com/jhumkas_by_malti/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-jewelry-400 transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="w-[18px] h-[18px]" />
              </a>
              <a
                href="https://pin.it/4RhiTEUIl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-jewelry-400 transition-colors flex items-center justify-center"
                aria-label="Visit our Pinterest boards"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path d="M12.289 2C6.617 2 2 6.617 2 12.289c0 4.354 2.722 8.076 6.555 9.538-.09-.816-.172-2.072.036-2.964.188-.8.1.1 1.204-4.598 0 0-.306-.612-.306-1.51 0-1.414.821-2.47 1.84-2.47.868 0 1.286.652 1.286 1.434 0 .872-.556 2.177-.842 3.385-.24.1-.47.3-.65.49-.868.868-.65 2.146.438 2.146 1.285 0 2.274-1.356 2.274-3.314 0-1.734-1.246-2.946-3.028-2.946-2.062 0-3.273 1.546-3.273 3.146 0 .624.24 1.293.54 1.655.06.072.068.136.05.21-.054.22-.174.708-.198.806-.032.13-.106.158-.244.094-1.018-.474-1.653-1.96-1.653-3.156 0-2.57 1.868-4.93 5.385-4.93 2.827 0 5.024 2.016 5.024 4.707 0 2.809-1.77 5.07-4.228 5.07-.825 0-1.601-.429-1.867-.936l-.608 2.314c-.22.84-.816 1.896-1.216 2.55C10.158 21.782 11.056 22 12.01 22 17.684 22 22 17.684 22 12.01 22 6.336 17.684 2 12.289 2z" />
                </svg>
              </a>
              <a
                href="https://wa.me/8238672255"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-jewelry-400 transition-colors flex items-center justify-center"
                aria-label="Contact us on WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path d="M12.012 2c-5.506 0-9.97 4.463-9.97 9.969 0 1.93.546 3.732 1.499 5.279L2 22l4.902-1.286c1.474.808 3.161 1.272 4.957 1.272 5.505 0 9.97-4.464 9.97-9.97C21.929 6.463 17.517 2 12.012 2zm6.368 14.54c-.263.742-1.528 1.353-2.1 1.393-.572.04-1.298.058-2.096-.2-3.176-1.026-5.215-4.225-5.373-4.437-.159-.212-1.286-1.713-1.286-3.267 0-1.554.815-2.319 1.107-2.617.291-.297.635-.371.847-.371.212 0 .424.001.609.009.193.008.45-.072.705.545.263.636.9 2.196.979 2.356.079.16.132.348.026.559-.106.212-.159.344-.318.528-.159.184-.334.409-.477.551-.159.159-.328.329-.142.648.185.318.823 1.356 1.764 2.197.94.84 1.731 1.102 2.049 1.261.318.16.504.133.689-.08.185-.212.802-.931 1.02-1.25.212-.319.424-.265.715-.159.292.106 1.854.874 2.172 1.034.318.16.53.238.609.371.079.133.079.742-.184 1.484z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-serif font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-jewelry-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-gray-400 hover:text-jewelry-300 transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-jewelry-300 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-jewelry-300 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4">
            <h4 className="text-lg font-serif font-semibold mb-4 text-white">
              Contact Us
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-jewelry-400" />
                <span>+91 8238672255</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-jewelry-400" />
                <a href="mailto:sshreecollection593@gmail.com" className="hover:text-jewelry-300 transition-colors break-all">
                  sshreecollection593@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-serif font-semibold mb-4 text-white">
              Join Our Newsletter
            </h4>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            {subscribed ? (
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-jewelry-300 text-sm">
                  Thank you for subscribing! You will receive our updates soon.
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
            &copy; {new Date().getFullYear()} Jhumkas by Malti. All rights
            reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="/privacy-policy" className="hover:text-jewelry-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-jewelry-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping-policy" className="hover:text-jewelry-300 transition-colors">
              Shipping Policy
            </Link>
            <Link href="/admin" className="hover:text-jewelry-300 transition-colors border-l border-gray-700 pl-4">
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
