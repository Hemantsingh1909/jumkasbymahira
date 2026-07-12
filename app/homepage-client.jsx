'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '@/src/store/productSlice';
import ProductCard from '@/src/components/ProductCard';
import Link from 'next/link';

export default function HomepageClient({ initialProducts = [] }) {
  const dispatch = useDispatch();
  const reduxProducts = useSelector((state) => state.products.products || []);
  const products = initialProducts.length > 0 ? initialProducts : reduxProducts;

  // Sync initialProducts with Redux store
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      dispatch(setProducts(initialProducts));
      return;
    }
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          dispatch(setProducts(data));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [dispatch, initialProducts]);

  const slides = [
    {
      image: '/images/hero/Hero Section 03.jpg',
      title: 'Elegant Pearl Collection',
      subtitle: 'Lustrous freshwater pearl earrings blending classic charm with modern styling.',
      ctaText: 'Explore Pearls',
      link: '/products?category=everyday',
      positionClass: 'bg-right-top',
      originClass: 'origin-top-right',
    },
    {
      image: '/images/hero/Hero Section 04.jpg',
      title: 'Timeless Silver Classics',
      subtitle: 'Stunning silver-plated dangle earrings decorated with brilliant crystals.',
      ctaText: 'Explore Silver',
      link: '/products?category=everyday',
      positionClass: 'bg-right-top',
      originClass: 'origin-top-right',
    },
    {
      image: '/images/hero/Hero Section 01.jpg',
      title: 'Exquisite Gold Jhumkas',
      subtitle: 'Handcrafted luxury gold plated traditional jhumkas for your special moments.',
      ctaText: 'Explore Gold Collection',
      link: '/products?category=jhumkas',
      positionClass: 'bg-right-top',
      originClass: 'origin-top-right',
    },
    {
      image: '/images/hero/Hero Section 02.jpg',
      title: 'Intricate Kundan Sets',
      subtitle: 'Timeless heritage designs crafted with precision by master artisans.',
      ctaText: 'Explore Kundan',
      link: '/products?category=bridal-sets',
      positionClass: 'bg-top',
      originClass: 'origin-top',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-gray-50">
      {/* Dynamic Hero Carousel */}
      <section className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-jewelry-950">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
            >
              {/* Slide Background Image focused on the right-side product/model with zoom-out animation */}
              <div
                className={`absolute inset-0 bg-cover bg-right-top origin-top-right ${isActive ? 'animate-ken-burns-out' : ''
                  }`}
                style={{
                  backgroundImage: `url('${slide.image}')`,
                }}
              />
              {/* Semi-transparent dark overlay fading to transparent on the right */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
            </div>
          );
        })}

        {/* Static Overlay Content (Text and Buttons) */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center">
          <div className="container-custom relative w-full flex flex-col items-start text-left text-white px-6 sm:px-12 lg:px-16 pointer-events-auto">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 max-w-xl md:max-w-2xl">
              Exquisite <span className="text-[#E6455F] font-bold">Jhumkas</span> for Every Occasion
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg md:max-w-xl mb-8">
              Handcrafted with love and tradition, our jhumkas blend timeless
              elegance with contemporary design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/collections"
                className="btn bg-jewelry-600 text-white hover:bg-jewelry-700 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Explore Collections
              </Link>
              <Link
                href="/products"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-jewelry-950 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Shop All Products
              </Link>
            </div>
          </div>
        </div>



        {/* Carousel Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-jewelry-500 w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-jewelry-800 mb-4">Our Bestsellers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most loved jhumkas, handpicked for their exquisite
              craftsmanship and timeless appeal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
