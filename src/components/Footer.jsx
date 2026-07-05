// src/components/Footer.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
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
                className="text-gray-400 hover:text-jewelry-400 transition-colors flex items-center justify-center"
                aria-label="Visit our Instagram page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
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
                  viewBox="0 0 496 512"
                  fill="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-108.8 0-169.5 77.7-169.5 161.4 0 37.1 19.2 84 50.8 98.9 5.4 2.5 8.3 1.4 9.6-3.8 1-3.9 3.3-13.6 4.7-19 1.4-5.6 1-8.3-3.2-13.4-9.6-11.6-17.5-26.6-17.5-48.9 0-63 47.4-124.7 127.3-124.7 69.3 0 117.7 47.4 117.7 112 0 76.5-38.3 129.5-91.1 129.5-28.3 0-49.4-23.3-42.6-52 8.2-34.6 24-71.9 24-96.9 0-22.3-12-41-41-41-32.5 0-58.7 33.6-58.7 78.6 0 28.8 9.7 48.3 9.7 48.3s-3.2 13.5-9.7 41c-10.1 42.6-15.1 95.2-12.6 142.9C64.9 443.3 0 357.1 0 256 0 119 111 8 248 8s248 111 248 248z" />
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
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.8 111.2L3 480l112.5-29.5c32.9 17.5 69.6 26.8 108.4 26.8 122.4 0 222-99.6 222-222 0-59.3-23.2-115.1-65-157.2zM223.9 446c-33.1 0-65.6-8.9-93.9-25.7l-6.7-4-69.8 18.3L72 366.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.4 0 101.7-82.8 184.5-184.6 184.5zm100.5-137.5c-5.5-2.7-32.6-16.1-37.7-18-5.1-1.9-8.8-2.7-12.5 2.7-3.7 5.5-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.7-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.6-13.4 37.2-26.3 4.6-13 4.6-24.1 3.2-26.3-1.4-2.2-5-3.5-10.5-6.2z" />
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
