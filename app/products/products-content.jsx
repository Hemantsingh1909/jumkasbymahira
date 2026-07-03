'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { setProducts } from '@/src/store/productSlice';
import ProductCard from '@/src/components/ProductCard';

export default function ProductsContent({ initialProducts = [] }) {
  const products = useSelector((state) => state.products.products || []);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOption, setSortOption] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const categories = [
    { id: 'jhumkas', name: 'Jhumkas' },
    { id: 'meenakari', name: 'Meenakari' },
    { id: 'chandbali', name: 'Chandbali' },
    { id: 'bridal sets', name: 'Bridal Sets' },
    { id: 'everyday', name: 'Everyday Wear' },
  ];

  const materials = [
    { id: 'Gold Plated', name: 'Gold Plated' },
    { id: 'Silver', name: 'Silver' },
    { id: 'Brass', name: 'Brass' },
    { id: 'Kundan', name: 'Kundan' },
  ];

  const occasions = [
    { id: 'Bridal', name: 'Bridal / Wedding' },
    { id: 'Festive', name: 'Festive / Traditional' },
    { id: 'Everyday', name: 'Everyday Wear' },
  ];

  const colors = [
    { id: 'Gold', name: 'Gold' },
    { id: 'White', name: 'White / Pearl' },
    { id: 'Red', name: 'Red / Ruby' },
    { id: 'Green', name: 'Green / Emerald' },
    { id: 'Silver', name: 'Silver' },
    { id: 'Pink', name: 'Pink' },
  ];

  // Fetch products from database
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
        product.name.toLowerCase().includes(lowerCaseSearch) ||
        product.sku?.toLowerCase().includes(lowerCaseSearch) ||
        product.tags?.some(t => t.toLowerCase().includes(lowerCaseSearch))
      );
    }

    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category?.toLowerCase())
      );
    }

    if (selectedMaterials.length > 0) {
      result = result.filter((product) =>
        selectedMaterials.includes(product.material)
      );
    }

    if (selectedOccasions.length > 0) {
      result = result.filter((product) =>
        selectedOccasions.includes(product.occasion)
      );
    }

    if (selectedColors.length > 0) {
      result = result.filter((product) =>
        selectedColors.includes(product.color)
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
  }, [products, searchTerm, priceRange, selectedCategories, selectedMaterials, selectedOccasions, selectedColors, sortOption]);

  // Handle click outside for sort dropdown
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

  const toggleFilter = (list, setList, id) => {
    setList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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
          <aside className="w-full lg:w-72">
            <div className="bg-white rounded-lg p-6 space-y-6 shadow-sm">
              {/* Search Result Info */}
              {searchTerm && (
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Search query:</p>
                  <p className="text-md font-semibold text-jewelry-700 flex justify-between items-center mt-1">
                    &quot;{searchTerm}&quot;
                    <button onClick={() => setSearchTerm('')} className="text-xs text-red-500 hover:underline">
                      clear
                    </button>
                  </p>
                </div>
              )}

              {/* Price Filter */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full accent-jewelry-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleFilter(selectedCategories, setSelectedCategories, category.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-jewelry-500"
                      />
                      <span className="ml-2 text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materials Filter */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Material</h3>
                <div className="space-y-2">
                  {materials.map((mat) => (
                    <label key={mat.id} className="flex items-center cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(mat.id)}
                        onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, mat.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-jewelry-500"
                      />
                      <span className="ml-2 text-gray-700">{mat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasions Filter */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Occasion</h3>
                <div className="space-y-2">
                  {occasions.map((occ) => (
                    <label key={occ.id} className="flex items-center cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occ.id)}
                        onChange={() => toggleFilter(selectedOccasions, setSelectedOccasions, occ.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-jewelry-500"
                      />
                      <span className="ml-2 text-gray-700">{occ.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors Filter */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <label key={color.id} className="flex items-center cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color.id)}
                        onChange={() => toggleFilter(selectedColors, setSelectedColors, color.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-jewelry-500"
                      />
                      <span className="ml-2 text-gray-700">{color.name}</span>
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
                  setSelectedMaterials([]);
                  setSelectedOccasions([]);
                  setSelectedColors([]);
                  setSortOption('featured');
                }}
                className="w-full bg-jewelry-600 text-white py-2 rounded hover:bg-jewelry-700 text-sm font-medium transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid Section */}
          <div className="flex-1">
            {/* Sort Dropdown */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 text-sm">
                Showing {filteredProducts.length} products
              </p>
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-white px-4 py-2 rounded border border-gray-300 hover:border-jewelry-600 text-sm flex items-center gap-2"
                >
                  Sort: {sortOption} <i className="fas fa-chevron-down text-xs"></i>
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
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
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
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <i className="fas fa-search text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500 text-md">No products match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
