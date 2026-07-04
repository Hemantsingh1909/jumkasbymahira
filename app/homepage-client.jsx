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

    </div>
  );
}
