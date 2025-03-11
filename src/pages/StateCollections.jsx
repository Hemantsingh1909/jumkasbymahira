import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

// Import all state SVGs
import rajasthanSvg from "../assets/1.svg";
import gujaratSvg from "../assets/2.svg";
import tamilnaduSvg from "../assets/3.svg";
import keralasvg from "../assets/4.svg";
import bengalSvg from "../assets/5.svg";
import punjabSvg from "../assets/6.svg";
import kashmirSvg from "../assets/7.svg";
import uttarPradeshSvg from "../assets/8.svg";
import maharashtraSvg from "../assets/9.svg";
import karnatakasvg from "../assets/10.svg";
import andhrapradeshSvg from "../assets/11.svg";
import odishaSvg from "../assets/12.svg";

const StateCollections = () => {
  const products = useSelector((state) => state.products.products);
  const [activeState, setActiveState] = useState("all");
  const location = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for state parameter from navigation
  useEffect(() => {
    // Check if we have state passed from navigation
    if (location.state && location.state.activeState) {
      setActiveState(location.state.activeState);
    }
    // Also check URL parameters for backward compatibility
    const params = new URLSearchParams(location.search);
    const stateParam = params.get("state");
    if (stateParam) {
      setActiveState(stateParam);
    }
  }, [location]);

  // Define states with their jhumka styles
  const states = [
    {
      id: "all",
      name: "All States",
      description: "Explore jhumkas from all across India",
    },
    {
      id: "rajasthan",
      name: "Rajasthan",
      svg: rajasthanSvg,
      description:
        "Known for their intricate meenakari work and vibrant colors, Rajasthani jhumkas reflect the state's rich cultural heritage.",
      products: [1, 7], // IDs of products that belong to this state
    },
    {
      id: "gujarat",
      name: "Gujarat",
      svg: gujaratSvg,
      description:
        "Gujarati jhumkas feature delicate filigree work and often incorporate colorful beads and mirrors.",
      products: [2, 8],
    },
    {
      id: "tamilnadu",
      name: "Tamil Nadu",
      svg: tamilnaduSvg,
      description:
        "Tamil Nadu's jhumkas are characterized by their temple-inspired designs and traditional motifs.",
      products: [3, 9],
    },
    {
      id: "kerala",
      name: "Kerala",
      svg: keralasvg,
      description:
        "Kerala's jhumkas often feature intricate gold work with traditional temple designs.",
      products: [4, 10],
    },
    {
      id: "bengal",
      name: "West Bengal",
      svg: bengalSvg,
      description:
        "Bengali jhumkas are known for their delicate craftsmanship and often feature floral motifs.",
      products: [5],
    },
    {
      id: "punjab",
      name: "Punjab",
      svg: punjabSvg,
      description:
        "Punjabi jhumkas are bold and statement-making, often featuring pearls and colorful stones.",
      products: [6],
    },
    {
      id: "kashmir",
      name: "Kashmir",
      svg: kashmirSvg,
      description:
        "Kashmiri jhumkas showcase intricate craftsmanship with nature-inspired designs.",
      products: [1, 4],
    },
    {
      id: "uttarpradesh",
      name: "Uttar Pradesh",
      svg: uttarPradeshSvg,
      description:
        "Uttar Pradesh jhumkas often feature kundan work and traditional Mughal-inspired designs.",
      products: [7, 10],
    },
    {
      id: "maharashtra",
      name: "Maharashtra",
      svg: maharashtraSvg,
      description:
        "Maharashtrian jhumkas are known for their simplicity and elegance, often featuring pearl accents.",
      products: [2, 8],
    },
    {
      id: "karnataka",
      name: "Karnataka",
      svg: karnatakasvg,
      description:
        "Karnataka's jhumkas feature traditional temple designs with intricate gold work.",
      products: [3, 9],
    },
    {
      id: "andhrapradesh",
      name: "Andhra Pradesh",
      svg: andhrapradeshSvg,
      description:
        "Andhra Pradesh jhumkas often feature traditional temple motifs and pearl embellishments.",
      products: [5, 6],
    },
    {
      id: "odisha",
      name: "Odisha",
      svg: odishaSvg,
      description:
        "Odisha's jhumkas showcase tribal-inspired designs with unique craftsmanship.",
      products: [4, 10],
    },
  ];

  // Filter products based on active state
  const getFilteredProducts = () => {
    if (activeState === "all") {
      return products;
    }

    const selectedState = states.find((state) => state.id === activeState);
    if (selectedState && selectedState.products) {
      return products.filter((product) =>
        selectedState.products.includes(product.id)
      );
    }

    return [];
  };

  const filteredProducts = getFilteredProducts();
  const activeStateData =
    states.find((state) => state.id === activeState) || states[0];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-center text-jewelry-800 mb-4">
          Traditional Jhumkas Across India
        </h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Explore the diverse styles of jhumkas from different states of India,
          each reflecting the unique cultural heritage and craftsmanship
          traditions.
        </p>

        {/* State Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setActiveState(state.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeState === state.id
                  ? "bg-jewelry-600 text-white"
                  : "bg-white text-jewelry-800 hover:bg-jewelry-50 border border-jewelry-200"
              }`}
            >
              {state.name}
            </button>
          ))}
        </div>

        {/* State Information Section */}
        {activeState !== "all" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3 flex justify-center">
                <img
                  src={activeStateData.svg}
                  alt={`${activeStateData.name} traditional woman`}
                  className="h-64 object-contain"
                />
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-serif font-bold text-jewelry-800 mb-4">
                  {activeStateData.name} Jhumkas
                </h2>
                <p className="text-gray-700 mb-4">
                  {activeStateData.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-jewelry-100 text-jewelry-800 px-3 py-1 rounded-full text-sm">
                    Traditional
                  </span>
                  <span className="inline-block bg-jewelry-100 text-jewelry-800 px-3 py-1 rounded-full text-sm">
                    Handcrafted
                  </span>
                  <span className="inline-block bg-jewelry-100 text-jewelry-800 px-3 py-1 rounded-full text-sm">
                    Cultural
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No jhumkas found for this state.
              </p>
              <button
                onClick={() => setActiveState("all")}
                className="btn btn-primary"
              >
                View All Collections
              </button>
            </div>
          )}
        </div>

        {/* Cultural Significance Section */}
        <div className="mt-16 bg-jewelry-50 rounded-lg p-8">
          <h2 className="text-2xl font-serif font-bold text-jewelry-800 mb-4 text-center">
            Cultural Significance of Jhumkas
          </h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto text-center">
            Jhumkas are more than just jewelry; they are a reflection of
            India&apos;s rich cultural heritage. Each state has its unique
            style, influenced by local traditions, history, and craftsmanship.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-serif font-semibold text-jewelry-700 mb-3">
                Traditional Craftsmanship
              </h3>
              <p className="text-gray-600">
                The art of making jhumkas has been passed down through
                generations, with each region preserving its unique techniques
                and designs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-serif font-semibold text-jewelry-700 mb-3">
                Cultural Identity
              </h3>
              <p className="text-gray-600">
                Jhumkas often represent the cultural identity of a region, with
                designs inspired by local architecture, nature, and traditions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-serif font-semibold text-jewelry-700 mb-3">
                Ceremonial Significance
              </h3>
              <p className="text-gray-600">
                In many Indian cultures, jhumkas are an essential part of bridal
                jewelry and are worn during important ceremonies and festivals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateCollections;
