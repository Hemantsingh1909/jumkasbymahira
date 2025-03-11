// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const products = useSelector((state) => state.products.products);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Categories for filtering
  const categories = [
    { id: "gold", name: "Gold" },
    { id: "pearl", name: "Pearl" },
    { id: "kundan", name: "Kundan" },
    { id: "silver", name: "Silver" },
    { id: "diamond", name: "Diamond" },
  ];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check for search query in URL
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Filter by price range
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some((category) =>
          product.name.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Sort products
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Featured - no sorting needed
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, priceRange, selectedCategories, sortOption]);

  // Handle click outside to close sort dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    setPriceRange(newRange);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 30000]);
    setSelectedCategories([]);
    setSortOption("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-jewelry-800">
        All Products
      </h1>

      <div className="text-center mb-8">
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our complete catalog of exquisite handcrafted jewelry pieces.
          Each item is carefully designed and crafted to perfection.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-medium text-jewelry-800">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-jewelry-600 hover:text-jewelry-800 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-jewelry-800 mb-4">
                Search
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jewelry-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm ? (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                ) : (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fas fa-search"></i>
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-jewelry-800 mb-4">
                Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="h-5 w-5 text-jewelry-600 rounded border-gray-300 focus:ring-jewelry-500"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-3 text-gray-700 cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-jewelry-800 mb-4">
                Price Range
              </h3>
              <div className="flex justify-between mb-3">
                <span className="text-gray-700 font-medium">
                  ₹{priceRange[0].toLocaleString()}
                </span>
                <span className="text-gray-700 font-medium">
                  ₹{priceRange[1].toLocaleString()}
                </span>
              </div>
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="1000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jewelry-600"
                />
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jewelry-600 mt-1"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-jewelry-400 focus:border-transparent"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max="30000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-jewelry-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-3 bg-jewelry-50 text-jewelry-700 font-medium rounded-md hover:bg-jewelry-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Sort Options */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-600 mb-3 sm:mb-0">
                Showing {filteredProducts.length} of {products.length} products
              </p>

              <div className="w-full sm:w-auto">
                <div className="flex items-center">
                  <span className="mr-3 text-gray-700 font-medium">
                    Sort by:
                  </span>
                  <div
                    ref={sortRef}
                    className="relative inline-block w-full sm:w-auto"
                  >
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="flex items-center justify-between w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-jewelry-400"
                    >
                      <span className="text-gray-800">
                        {sortOption === "featured" && "Featured"}
                        {sortOption === "price-low-high" &&
                          "Price: Low to High"}
                        {sortOption === "price-high-low" &&
                          "Price: High to Low"}
                        {sortOption === "name-a-z" && "Name: A to Z"}
                        {sortOption === "name-z-a" && "Name: Z to A"}
                      </span>
                      <i
                        className={`fas fa-chevron-${
                          isSortOpen ? "up" : "down"
                        } text-gray-500`}
                      ></i>
                    </button>

                    {isSortOpen && (
                      <div className="absolute right-0 z-50 mt-1 w-full min-w-[200px] bg-white shadow-lg rounded-md py-1 border border-gray-200">
                        {[
                          { value: "featured", label: "Featured" },
                          {
                            value: "price-low-high",
                            label: "Price: Low to High",
                          },
                          {
                            value: "price-high-low",
                            label: "Price: High to Low",
                          },
                          { value: "name-a-z", label: "Name: A to Z" },
                          { value: "name-z-a", label: "Name: Z to A" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortOption(option.value);
                              setIsSortOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                              sortOption === option.value
                                ? "bg-jewelry-50 text-jewelry-600 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-lg shadow-sm text-center">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-search text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                No products found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try
                adjusting your search criteria or browse our entire collection.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-jewelry-600 text-white font-medium rounded-md hover:bg-jewelry-700 transition-colors"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
