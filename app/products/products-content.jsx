'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts } from '@/src/store/productSlice';
import ProductCard from '@/src/components/ProductCard';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsContent({ initialProducts = [], searchParams = {} }) {
  const products = useSelector((state) => state.products.products || []);
  const dispatch = useDispatch();
  
  const searchQuery = searchParams?.search;
  const categoryQuery = searchParams?.category;

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOption, setSortOption] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const sortRef = useRef(null);

  const categories = [
    { id: 'jhumkas', name: 'Jhumkas' },
    { id: 'meenakari', name: 'Meenakari' },
    { id: 'chandbali', name: 'Chandbali' },
    { id: 'bridal-sets', name: 'Bridal Sets' },
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

  // Check for search query or category filter in URL
  useEffect(() => {
    window.scrollTo(0, 0);
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    if (categoryQuery) {
      setSelectedCategories([categoryQuery.toLowerCase()]);
    }
  }, [searchQuery, categoryQuery]);

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
      result = result.filter((product) => {
        const prodCat = product.category?.toLowerCase();
        return selectedCategories.some(cat => 
          cat === prodCat || cat.replace('-', ' ') === prodCat
        );
      });
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
          {/* Sidebar Filters - Desktop Only */}
          <aside className="hidden lg:block lg:w-72">
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
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-white px-4 py-2 rounded border border-gray-300 hover:border-jewelry-600 text-sm flex items-center gap-2"
                >
                   Sort: {sortOption} <ChevronDown className="w-3.5 h-3.5" />
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
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 3} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                 <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-md">No products match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Mobile Filter Trigger */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="bg-jewelry-900 text-white font-display font-semibold py-3.5 px-6 rounded-full shadow-lg border border-jewelry-800 flex items-center gap-3 active:scale-95 transition-transform"
        >
          <svg
            className="w-5 h-5 text-jewelry-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white flex flex-col shadow-xl animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-jewelry-900 flex items-center gap-2">
                   <SlidersHorizontal className="w-5 h-5 text-jewelry-600 inline" /> Filters
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-500 p-1"
                >
                   <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Search query tag */}
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

                {/* Price range */}
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

                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <label 
                        key={category.id} 
                        className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                          selectedCategories.includes(category.id) 
                            ? 'border-jewelry-600 bg-jewelry-50/50 text-jewelry-800' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleFilter(selectedCategories, setSelectedCategories, category.id)}
                          className="sr-only"
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Material</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {materials.map((mat) => (
                      <label 
                        key={mat.id} 
                        className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                          selectedMaterials.includes(mat.id) 
                            ? 'border-jewelry-600 bg-jewelry-50/50 text-jewelry-800' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(mat.id)}
                          onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, mat.id)}
                          className="sr-only"
                        />
                        <span>{mat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Occasion */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Occasion</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {occasions.map((occ) => (
                      <label 
                        key={occ.id} 
                        className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                          selectedOccasions.includes(occ.id) 
                            ? 'border-jewelry-600 bg-jewelry-50/50 text-jewelry-800' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedOccasions.includes(occ.id)}
                          onChange={() => toggleFilter(selectedOccasions, setSelectedOccasions, occ.id)}
                          className="sr-only"
                        />
                        <span>{occ.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {colors.map((color) => (
                      <label 
                        key={color.id} 
                        className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                          selectedColors.includes(color.id) 
                            ? 'border-jewelry-600 bg-jewelry-50/50 text-jewelry-800' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color.id)}
                          onChange={() => toggleFilter(selectedColors, setSelectedColors, color.id)}
                          className="sr-only"
                        />
                        <span>{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-4 bg-gray-50">
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
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 bg-jewelry-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-jewelry-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
