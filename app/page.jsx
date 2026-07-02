'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '@/src/store/productSlice';
import ProductCard from '@/src/components/ProductCard';
import Link from 'next/link';

// Import all 10 images directly
import one from '@/src/assets/one.jpeg';
import two from '@/src/assets/two.jpeg';
import three from '@/src/assets/three.jpeg';
import four from '@/src/assets/four.jpeg';
import five from '@/src/assets/five.jpeg';
import six from '@/src/assets/six.jpeg';
import seven from '@/src/assets/seven.jpeg';
import eight from '@/src/assets/eight.jpeg';
import nine from '@/src/assets/nine.jpeg';
import ten from '@/src/assets/ten.jpeg';

// Import state SVGs
import rajasthanSvg from '@/src/assets/1.svg';
import gujaratSvg from '@/src/assets/2.svg';
import tamilnaduSvg from '@/src/assets/3.svg';
import karnatakaImg from '@/src/assets/4.svg';
import bengalImg from '@/src/assets/5.svg';
import kashmirImg from '@/src/assets/6.svg';
import keralaImg from '@/src/assets/7.svg';
import upImg from '@/src/assets/8.svg';

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Load products
  useEffect(() => {
    const localProducts = [
      { id: 1, name: 'Gold Jhumka', image: one, price: 12999.99 },
      { id: 2, name: 'Pearl Earrings', image: two, price: 8499.5 },
      { id: 3, name: 'Diamond Studs', image: three, price: 24999.99 },
      { id: 4, name: 'Ruby Danglers', image: four, price: 15999.99 },
      { id: 5, name: 'Emerald Drops', image: five, price: 18499.5 },
      { id: 6, name: 'Silver Hoops', image: six, price: 5999.99 },
      { id: 7, name: 'Kundan Jhumka', image: seven, price: 9999.99 },
      { id: 8, name: 'Antique Chandbali', image: eight, price: 11499.5 },
      { id: 9, name: 'Meenakari Earrings', image: nine, price: 7999.99 },
      { id: 10, name: 'Crystal Danglers', image: ten, price: 6499.99 },
    ];

    dispatch(setProducts(localProducts));
  }, [dispatch]);

  const stateCollections = [
    { id: 'rajasthan', name: 'Rajasthan', image: rajasthanSvg, description: 'Known for vibrant colors and intricate meenakari work' },
    { id: 'gujarat', name: 'Gujarat', image: gujaratSvg, description: 'Features delicate filigree work and colorful beads' },
    { id: 'tamilnadu', name: 'Tamil Nadu', image: tamilnaduSvg, description: 'Characterized by temple-inspired designs' },
    { id: 'karnataka', name: 'Karnataka', image: karnatakaImg, description: 'Famous for traditional Kasuti embroidery-inspired designs' },
    { id: 'bengal', name: 'West Bengal', image: bengalImg, description: 'Renowned for intricate filigree work and Dokra art' },
    { id: 'kashmir', name: 'Kashmir', image: kashmirImg, description: 'Celebrated for delicate enamel work and nature motifs' },
    { id: 'kerala', name: 'Kerala', image: keralaImg, description: 'Known for traditional temple jewelry designs' },
    { id: 'up', name: 'Uttar Pradesh', image: upImg, description: 'Famous for Kundan and Polki work from Varanasi' },
  ];

  // Auto-slide effect
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === stateCollections.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stateCollections.length, isAutoPlaying]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-jewelry-50 to-jewelry-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10"></div>
        <div className="container-custom relative py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-jewelry-900 mb-6">
            Exquisite <span className="text-jewelry-600">Jhumkas</span> for
            Every Occasion
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
            Handcrafted with love and tradition, our jhumkas blend timeless
            elegance with contemporary design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/collections" className="btn btn-primary">
              Explore Collections
            </Link>
            <Link href="/products" className="btn btn-secondary">
              Shop All Products
            </Link>
          </div>
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

      {/* State Collections Slider */}
      <section className="section bg-jewelry-50 overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-jewelry-800 mb-4">Jhumkas Across India</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the rich diversity of jhumka styles from different states
              of India, each with its unique cultural heritage.
            </p>
          </div>

          <div className="relative">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {stateCollections.map((state) => (
                <div key={state.id} className="min-w-full px-4">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/2">
                        <div className="h-64 md:h-96 overflow-hidden bg-jewelry-50">
                          <img
                            src={state.image.src}
                            alt={state.name}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                      </div>
                      <div className="md:w-1/2 p-8 flex flex-col justify-center">
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-jewelry-800 mb-4">
                          {state.name}
                        </h3>
                        <div className="w-16 h-1 bg-jewelry-600 mb-6"></div>
                        <p className="text-gray-600 text-lg mb-6">
                          {state.description}
                        </p>
                        <Link
                          href="/state-collections"
                          className="btn btn-primary inline-block w-fit"
                        >
                          Explore {state.name} Collection
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2">
              <button
                className="bg-white/80 hover:bg-white text-jewelry-800 p-2 rounded-full shadow-md z-10"
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? stateCollections.length - 1 : prev - 1
                  )
                }
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2">
              <button
                className="bg-white/80 hover:bg-white text-jewelry-800 p-2 rounded-full shadow-md z-10"
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === stateCollections.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {stateCollections.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide
                      ? 'bg-jewelry-600'
                      : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
