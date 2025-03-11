import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Collections = () => {
  const products = useSelector((state) => state.products.products);
  const [activeCollection, setActiveCollection] = useState("all");
  const location = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for filter parameter from navigation
  useEffect(() => {
    // Check if we have state passed from navigation
    if (location.state && location.state.filter) {
      setActiveCollection(location.state.filter);
    }
    // Also check URL parameters for backward compatibility
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam) {
      setActiveCollection(filterParam);
    }
  }, [location]);

  // Define collections
  const collections = [
    { id: "all", name: "All Collections" },
    {
      id: "gold",
      name: "Gold Collection",
      filter: (p) => p.name.toLowerCase().includes("gold"),
    },
    {
      id: "pearl",
      name: "Pearl Collection",
      filter: (p) => p.name.toLowerCase().includes("pearl"),
    },
    {
      id: "diamond",
      name: "Diamond Collection",
      filter: (p) => p.name.toLowerCase().includes("diamond"),
    },
    {
      id: "kundan",
      name: "Kundan Collection",
      filter: (p) => p.name.toLowerCase().includes("kundan"),
    },
    {
      id: "silver",
      name: "Silver Collection",
      filter: (p) => p.name.toLowerCase().includes("silver"),
    },
  ];

  // Filter products based on active collection
  const filteredProducts =
    activeCollection === "all"
      ? products
      : products.filter(
          collections.find((c) => c.id === activeCollection).filter
        );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-rose-700">
        Our Collections
      </h1>

      {/* Collection Tabs */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => setActiveCollection(collection.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCollection === collection.id
                ? "bg-rose-600 text-white"
                : "bg-rose-100 text-rose-800 hover:bg-rose-200"
            }`}
          >
            {collection.name}
          </button>
        ))}
      </div>

      {/* Collection Description */}
      <div className="text-center mb-8">
        <p className="text-gray-600 max-w-2xl mx-auto">
          {activeCollection === "all"
            ? "Explore our complete range of exquisite handcrafted jewelry pieces."
            : `Discover our ${collections
                .find((c) => c.id === activeCollection)
                .name.toLowerCase()} featuring stunning designs and exceptional craftsmanship.`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No products found in this collection.
          </p>
        )}
      </div>
    </div>
  );
};

export default Collections;
