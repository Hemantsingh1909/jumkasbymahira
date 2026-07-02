'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/src/components/ProductCard';

export default function ProductsContent() {
  const products = useSelector((state) => state.products.products);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const categories = [
    { id: 'gold', name: 'Gold' },
    { id: 'pearl', name: 'Pearl' },
    { id: 'kundan', name: 'Kundan' },
    { id: 'silver', name: 'Silver' },
    { id: 'diamond', name: 'Diamond' },
  ];

  // Check for search query in URL
  useEffect(() => {
    window.scrollTo(0, 0);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseSearch)
      );
    }

    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some((category) =>
          product.name.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, priceRange, selectedCategories, sortOption]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <h1 className="text-4xl font-display font-bold text-jewelry-900 mb-8">
          All Products
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64">
            <div className="bg-white rounded-lg p-6 space-y-6">
              {/* Price Filter */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange([0, 30000]);
                  setSelectedCategories([]);
                  setSortOption('featured');
                }}
                className="w-full bg-jewelry-600 text-white py-2 rounded hover:bg-jewelry-700"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Sort Dropdown */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-white px-4 py-2 rounded border border-gray-300 hover:border-jewelry-600"
                >
                  Sort: {sortOption} <i className="fas fa-chevron-down ml-2"></i>
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-48">
                    {[
                      { value: 'featured', label: 'Featured' },
                      { value: 'price-low-high', label: 'Price: Low to High' },
                      { value: 'price-high-low', label: 'Price: High to Low' },
                      { value: 'name-a-z', label: 'Name: A to Z' },
                      { value: 'name-z-a', label: 'Name: Z to A' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortOption(option.value);
                          setIsSortOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
