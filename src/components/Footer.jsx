// src/components/Footer.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <footer className="bg-[#FAF6F0] text-gray-700 relative overflow-hidden pt-16">
      {/* Decorative Floral Backgrounds */}
      <div 
        className="absolute left-0 bottom-16 w-[360px] h-[360px] pointer-events-none select-none opacity-[0.06] mix-blend-multiply bg-no-repeat bg-left-bottom hidden xl:block"
        style={{ 
          backgroundImage: `url('/images/floral-ornament.png')`,
          backgroundSize: 'contain',
        }}
      />
      <div 
        className="absolute right-0 bottom-16 w-[360px] h-[360px] pointer-events-none select-none opacity-[0.06] mix-blend-multiply bg-no-repeat bg-right-bottom scale-x-[-1] hidden xl:block"
        style={{ 
          backgroundImage: `url('/images/floral-ornament.png')`,
          backgroundSize: 'contain',
        }}
      />

      <div className="container-custom max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8 gap-y-10 md:gap-y-8 lg:flex lg:flex-row lg:justify-between lg:items-stretch lg:gap-y-0 lg:gap-x-0 pb-8 text-center md:text-center lg:text-left">
          
          {/* Brand Section */}
          <div className="col-span-12 md:col-span-12 lg:w-[24%] md:border-b lg:border-b-0 lg:border-r md:border-[#E8DCC4]/60 md:pb-8 md:mb-8 lg:pb-0 lg:mb-0 lg:pr-8 flex flex-col items-center md:items-center lg:items-start">
            <Link href="/" className="flex items-center justify-center md:justify-center lg:justify-start shrink-0 select-none">
              <div className="text-jewelry-800 font-display">
                <span className="text-2xl font-bold">Jhumkas</span>
                <span className="text-xl text-jewelry-600 italic ml-1">
                  by Malti
                </span>
              </div>
            </Link>
            
            <p className="text-gray-600 text-sm mt-5 leading-relaxed max-w-xs text-center md:text-center lg:text-left">
              Exquisite jhumkas for every occasion, crafted with love and tradition.
            </p>

            {/* Line-Lotus-Line Divider */}
            <div className="flex items-center gap-3 my-6 w-full max-w-[200px] justify-center md:justify-center lg:justify-start">
              <div className="h-[0.5px] bg-[#D2AD7B]/40 flex-grow"></div>
              <svg className="w-5 h-5 text-[#C19A5B]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2s1.5 4.5 3 6c1.5 1.5 5 2.5 5 4.5s-3 3-5 3.5c-2 .5-3 2-3 4 0-2-1-3.5-3-4-2-.5-5-1.5-5-3.5s3.5-3 5-4.5c1.5-1.5 3-6 3-6zm0 4.5c-.5 1-1.5 2.5-2.5 3.5-1 1-3 1.5-3 2.5 0 .8 1.5 1.2 2.5 1.5 1 .3 1.8 1 2.2 2 .4-1 1.2-1.7 2.2-2 1-.3 2.5-.7 2.5-1.5 0-1-2-1.5-3-2.5-1-1-2-2.5-2.5-3.5z" />
              </svg>
              <div className="h-[0.5px] bg-[#D2AD7B]/40 flex-grow"></div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3.5 mt-2 justify-center md:justify-center lg:justify-start">
              <a
                href="https://www.instagram.com/jhumkas_by_malti/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3EFE9] text-[#5C1625] hover:bg-[#5C1625] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Visit our Instagram page"
              >
                <i className="fa-brands fa-instagram text-base"></i>
              </a>
              <a
                href="https://pin.it/4RhiTEUIl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3EFE9] text-[#5C1625] hover:bg-[#5C1625] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Visit our Pinterest boards"
              >
                <i className="fa-brands fa-pinterest text-base"></i>
              </a>
              <a
                href="https://wa.me/8238672255"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3EFE9] text-[#5C1625] hover:bg-[#5C1625] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Contact us on WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
              </a>
              <a
                href="mailto:sshreecollection593@gmail.com"
                className="w-9 h-9 rounded-full bg-[#F3EFE9] text-[#5C1625] hover:bg-[#5C1625] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Send us an email"
              >
                <i className="fa-solid fa-envelope text-base"></i>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="col-span-12 md:col-span-4 lg:w-[15%] md:border-b lg:border-b-0 lg:border-r md:border-[#E8DCC4]/60 md:pb-8 md:mb-8 lg:pb-0 lg:mb-0 lg:px-6 flex flex-col items-center md:items-start mt-0">
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider text-[#5C1625] mb-2">
              Shop
            </h4>
            <div className="w-10 h-[1.5px] bg-[#C19A5B] mb-5"></div>
            <ul className="space-y-2 text-center md:text-left lg:text-left">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/best-sellers"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=gift-cards"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-span-12 md:col-span-4 lg:w-[17%] md:border-b lg:border-r lg:border-b-0 md:border-[#E8DCC4]/60 md:pb-8 md:mb-8 lg:pb-0 lg:mb-0 lg:px-6 flex flex-col items-center md:items-start mt-0">
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider text-[#5C1625] mb-2">
              Company
            </h4>
            <div className="w-10 h-[1.5px] bg-[#C19A5B] mb-5"></div>
            <ul className="space-y-2 text-center md:text-left lg:text-left">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about#craftsmanship"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  Our Craftsmanship
                </Link>
              </li>
              <li>
                <Link
                  href="/about#reviews"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/about#care-guide"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  Care Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-[#5C1625] transition-colors font-sans text-[13px] tracking-wide block py-1"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="col-span-12 md:col-span-4 lg:w-[24%] md:border-b lg:border-b-0 lg:border-r md:border-[#E8DCC4]/60 md:pb-8 md:mb-8 lg:pb-0 lg:mb-0 lg:px-6 flex flex-col items-center md:items-start mt-0">
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider text-[#5C1625] mb-2">
              Contact Us
            </h4>
            <div className="w-10 h-[1.5px] bg-[#C19A5B] mb-5"></div>
            <ul className="space-y-3.5 text-gray-600 text-[13px] font-sans w-full text-center md:text-left lg:text-left">
              <li className="flex items-start justify-center md:justify-start lg:justify-start gap-2.5">
                <i className="fa-solid fa-phone text-[#C19A5B] text-sm w-4 h-4 flex items-center justify-center shrink-0 mt-0.5"></i>
                <span className="leading-tight">+91 82386 72255</span>
              </li>
              <li className="flex items-start justify-center md:justify-start lg:justify-start gap-2.5">
                <i className="fa-solid fa-envelope text-[#C19A5B] text-sm w-4 h-4 flex items-center justify-center shrink-0 mt-0.5"></i>
                <a href="mailto:sshreecollection593@gmail.com" className="leading-tight hover:text-[#5C1625] transition-colors whitespace-nowrap">
                  sshreecollection593@gmail.com
                </a>
              </li>
              <li className="flex items-start justify-center md:justify-start lg:justify-start gap-2.5">
                <i className="fa-solid fa-location-dot text-[#C19A5B] text-sm w-4 h-4 flex items-center justify-center shrink-0 mt-0.5"></i>
                <span className="leading-tight">
                  Dahod, Gujrat, India - 389151
                </span>
              </li>
            </ul>
          </div>

          {/* Stay Connected Column */}
          <div className="col-span-12 md:col-span-12 lg:w-[20%] lg:pl-8 flex flex-col items-center md:items-center lg:items-start mt-0">
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider text-[#5C1625] mb-2">
              Stay Connected
            </h4>
            <div className="w-10 h-[1.5px] bg-[#C19A5B] mb-5"></div>
            <p className="text-gray-600 text-[13px] font-sans leading-relaxed mb-4 max-w-xs md:max-w-none text-center md:text-center lg:text-left">
              Subscribe to receive updates, exclusive offers, and more.
            </p>
            {subscribed ? (
              <div className="bg-[#FAF6F0] border border-[#C19A5B]/30 p-3 rounded-md w-full max-w-sm md:max-w-none">
                <p className="text-[#5C1625] text-xs font-medium">
                  Thank you for subscribing! You will receive our updates soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row w-full max-w-sm md:max-w-md lg:max-w-none gap-2 lg:gap-0 items-stretch justify-center md:justify-center lg:justify-start">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-white border border-[#E3D8C4] rounded-md lg:rounded-none lg:rounded-l-md px-3 py-2 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#5C1625] text-gray-800"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#4A1521] text-white px-4 py-2 rounded-md lg:rounded-none lg:rounded-r-md text-xs font-semibold hover:bg-[#5C1625] transition-colors duration-300 shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 font-sans justify-center md:justify-center lg:justify-start">
              <i className="fa-solid fa-lock text-[#C19A5B] text-[11px] w-3.5 h-3.5 flex items-center justify-center shrink-0"></i>
              <span>We respect your privacy. Unsubscribe anytime.</span>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Value Propositions Bar */}
      <div className="border-t border-[#E8DCC4] py-8 relative z-10">
        <div className="container-custom max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-start sm:justify-center lg:justify-between items-start sm:items-center gap-y-6 gap-x-8 lg:gap-x-0 w-fit sm:w-full mx-auto sm:mx-0">
            
            {/* Proposition 1 */}
            <div className="flex items-center justify-start gap-4 px-4 lg:flex-1 lg:justify-center lg:border-r lg:border-[#E8DCC4]/60 lg:pr-6">
              <i className="fa-solid fa-gem text-[#C19A5B] text-2xl shrink-0"></i>
              <div className="text-left">
                <h5 className="font-serif text-sm font-bold text-gray-800">Premium Quality</h5>
                <p className="text-xs text-gray-500 font-sans mt-0.5">Finest materials</p>
              </div>
            </div>

            {/* Proposition 2 */}
            <div className="flex items-center justify-start gap-4 px-4 lg:px-6 lg:flex-1 lg:justify-center lg:border-r lg:border-[#E8DCC4]/60">
              <i className="fa-solid fa-hand-holding-heart text-[#C19A5B] text-2xl shrink-0"></i>
              <div className="text-left">
                <h5 className="font-serif text-sm font-bold text-gray-800">Handcrafted with Love</h5>
                <p className="text-xs text-gray-500 font-sans mt-0.5">By skilled artisans</p>
              </div>
            </div>

            {/* Proposition 3 */}
            <div className="flex items-center justify-start gap-4 px-4 lg:px-6 lg:flex-1 lg:justify-center lg:border-r lg:border-[#E8DCC4]/60">
              <i className="fa-solid fa-truck text-[#C19A5B] text-2xl shrink-0"></i>
              <div className="text-left">
                <h5 className="font-serif text-sm font-bold text-gray-800">Free Shipping</h5>
                <p className="text-xs text-gray-500 font-sans mt-0.5">On orders above ₹1499</p>
              </div>
            </div>

            {/* Proposition 4 */}
            <div className="flex items-center justify-start gap-4 px-4 lg:px-6 lg:flex-1 lg:justify-center lg:border-r lg:border-[#E8DCC4]/60">
              <i className="fa-solid fa-shield-halved text-[#C19A5B] text-2xl shrink-0"></i>
              <div className="text-left">
                <h5 className="font-serif text-sm font-bold text-gray-800">Secure Payments</h5>
                <p className="text-xs text-gray-500 font-sans mt-0.5">100% protected</p>
              </div>
            </div>

            {/* Proposition 5 */}
            <div className="flex items-center justify-start gap-4 px-4 lg:pl-6 lg:flex-1 lg:justify-center">
              <i className="fa-solid fa-arrow-rotate-left text-[#C19A5B] text-2xl shrink-0"></i>
              <div className="text-left">
                <h5 className="font-serif text-sm font-bold text-gray-800">Easy Returns</h5>
                <p className="text-xs text-gray-500 font-sans mt-0.5">Hassle-free returns</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#4A1521] py-6 relative z-10">
        <div className="container-custom max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          {/* Copyright Text */}
          <p className="text-xs text-[#E3D8C4] font-serif" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} Jhumkas by Malti. All rights reserved.
          </p>

          {/* Lotus Ornament */}
          <div className="flex items-center gap-4 text-[#D2AD7B]/50 w-full max-w-[200px] justify-center">
            <div className="h-[0.5px] bg-[#D2AD7B]/30 flex-grow"></div>
            <svg className="w-5 h-5 text-[#C19A5B]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2s1.5 4.5 3 6c1.5 1.5 5 2.5 5 4.5s-3 3-5 3.5c-2 .5-3 2-3 4 0-2-1-3.5-3-4-2-.5-5-1.5-5-3.5s3.5-3 5-4.5c1.5-1.5 3-6 3-6zm0 4.5c-.5 1-1.5 2.5-2.5 3.5-1 1-3 1.5-3 2.5 0 .8 1.5 1.2 2.5 1.5 1 .3 1.8 1 2.2 2 .4-1 1.2-1.7 2.2-2 1-.3 2.5-.7 2.5-1.5 0-1-2-1.5-3-2.5-1-1-2-2.5-2.5-3.5z" />
            </svg>
            <div className="h-[0.5px] bg-[#D2AD7B]/30 flex-grow"></div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 text-xs text-[#E3D8C4] font-sans">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-[#D2AD7B]/30">|</span>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-[#D2AD7B]/30">|</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
            <span className="text-[#D2AD7B]/30">|</span>
            <Link href="/shipping-policy#returns" className="hover:text-white transition-colors">Returns Policy</Link>
            <span className="text-[#D2AD7B]/30">|</span>
            <Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
