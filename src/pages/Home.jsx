import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../store/productSlice"; // Assuming you're using this action to set products from local data
import ProductCard from "../components/ProductCard"; // Import ProductCard to display individual products
import { Link } from "react-router-dom";

// Import all 10 images directly
import one from "../assets/one.jpeg";
import two from "../assets/two.jpeg";
import three from "../assets/three.jpeg";
import four from "../assets/four.jpeg";
import five from "../assets/five.jpeg";
import six from "../assets/six.jpeg";
import seven from "../assets/seven.jpeg";
import eight from "../assets/eight.jpeg";
import nine from "../assets/nine.jpeg";
import ten from "../assets/ten.jpeg";

// Import a few state SVGs for the cultural section
import rajasthanSvg from "../assets/1.svg";
import gujaratSvg from "../assets/2.svg";
import tamilnaduSvg from "../assets/3.svg";
import karnatakaImg from "../assets/4.svg"; // Repurposing existing images
import bengalImg from "../assets/5.svg";
import kashmirImg from "../assets/6.svg";
import keralaImg from "../assets/7.svg";
import upImg from "../assets/8.svg";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products); // Accessing products from Redux store
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // If you want to load products from local data, you can use useEffect like this
  useEffect(() => {
    // Create an array with all 10 products
    const localProducts = [
      { id: 1, name: "Gold Jhumka", image: one, price: 12999.99 },
      { id: 2, name: "Pearl Earrings", image: two, price: 8499.5 },
      { id: 3, name: "Diamond Studs", image: three, price: 24999.99 },
      { id: 4, name: "Ruby Danglers", image: four, price: 15999.99 },
      { id: 5, name: "Emerald Drops", image: five, price: 18499.5 },
      { id: 6, name: "Silver Hoops", image: six, price: 5999.99 },
      { id: 7, name: "Kundan Jhumka", image: seven, price: 9999.99 },
      { id: 8, name: "Antique Chandbali", image: eight, price: 11499.5 },
      { id: 9, name: "Meenakari Earrings", image: nine, price: 7999.99 },
      { id: 10, name: "Crystal Danglers", image: ten, price: 6499.99 },
    ];

    // Dispatch action to set products
    dispatch(setProducts(localProducts));
  }, [dispatch]);

  // Featured collections
  const collections = [
    {
      id: "gold",
      name: "Gold Collection",
      image: one,
      description: "Timeless gold jhumkas for every occasion",
    },
    {
      id: "kundan",
      name: "Kundan Collection",
      image: seven,
      description: "Traditional kundan designs with modern aesthetics",
    },
    {
      id: "pearl",
      name: "Pearl Collection",
      image: two,
      description: "Elegant pearl earrings for a sophisticated look",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Fashion Blogger",
      content:
        "The craftsmanship of these jhumkas is exceptional. I've received countless compliments on my Kundan jhumkas!",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 2,
      name: "Ananya Patel",
      role: "Loyal Customer",
      content:
        "I've been buying from Jhumkas by Mahira for years. The quality and designs are unmatched. Highly recommend!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Meera Kapoor",
      role: "Stylist",
      content:
        "These jhumkas are my go-to for styling clients for weddings and special occasions. Simply gorgeous!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  // State collections for the slider
  const stateCollections = [
    {
      id: "rajasthan",
      name: "Rajasthan",
      image: rajasthanSvg,
      description: "Known for vibrant colors and intricate meenakari work",
    },
    {
      id: "gujarat",
      name: "Gujarat",
      image: gujaratSvg,
      description: "Features delicate filigree work and colorful beads",
    },
    {
      id: "tamilnadu",
      name: "Tamil Nadu",
      image: tamilnaduSvg,
      description: "Characterized by temple-inspired designs",
    },
    {
      id: "karnataka",
      name: "Karnataka",
      image: karnatakaImg,
      description: "Famous for traditional Kasuti embroidery-inspired designs",
    },
    {
      id: "bengal",
      name: "West Bengal",
      image: bengalImg,
      description: "Renowned for intricate filigree work and Dokra art",
    },
    {
      id: "kashmir",
      name: "Kashmir",
      image: kashmirImg,
      description: "Celebrated for delicate enamel work and nature motifs",
    },
    {
      id: "kerala",
      name: "Kerala",
      image: keralaImg,
      description: "Known for traditional temple jewelry designs",
    },
    {
      id: "up",
      name: "Uttar Pradesh",
      image: upImg,
      description: "Famous for Kundan and Polki work from Varanasi",
    },
  ];

  // Auto-slide effect with play/pause functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === stateCollections.length - 1 ? 0 : prev + 1
        );
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stateCollections.length, isAutoPlaying]);

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

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
            <Link to="/collections" className="btn btn-primary">
              Explore Collections
            </Link>
            <Link to="/products" className="btn btn-secondary">
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
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* State Collections Section - Sliding Banner */}
      <section className="section bg-jewelry-50 overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-jewelry-800 mb-4">Jhumkas Across India</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the rich diversity of jhumka styles from different states
              of India, each with its unique cultural heritage.
            </p>
          </div>

          {/* Sliding Banner */}
          <div className="relative">
            {/* Main Slider */}
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {stateCollections.map((state) => (
                <div key={state.id} className="min-w-full px-4">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-1/2">
                        <div className="h-64 md:h-96 overflow-hidden bg-jewelry-50">
                          <img
                            src={state.image}
                            alt={state.name}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:w-1/2 p-8 flex flex-col justify-center">
                        <div className="mb-4">
                          <h3 className="text-2xl md:text-3xl font-display font-bold text-jewelry-800 mb-4">
                            {state.name}
                          </h3>
                          <div className="w-16 h-1 bg-jewelry-600 mb-6"></div>
                          <p className="text-gray-600 text-lg mb-6">
                            {state.description}
                          </p>
                          <Link
                            to={`/state-collections`}
                            state={{ activeState: state.id }}
                            className="btn btn-primary inline-block"
                          >
                            Explore {state.name} Collection
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows and Play/Pause Button */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2">
              <button
                className="bg-white/80 hover:bg-white text-jewelry-800 p-2 rounded-full shadow-md z-10"
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? stateCollections.length - 1 : prev - 1
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="bg-white/80 hover:bg-white text-jewelry-800 p-2 rounded-full shadow-md z-10"
                onClick={toggleAutoPlay}
                aria-label={
                  isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                }
              >
                {isAutoPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-jewelry-800 p-2 rounded-full shadow-md z-10"
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === stateCollections.length - 1 ? 0 : prev + 1
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {stateCollections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? "bg-jewelry-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-jewelry-800 mb-4">Explore Our Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From traditional designs to contemporary styles, find the perfect
              jhumkas for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections`}
                state={{ filter: collection.id }}
                className="group relative overflow-hidden rounded-lg shadow-lg"
              >
                <div className="aspect-w-3 aspect-h-4 w-full">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-200 mb-4">
                      {collection.description}
                    </p>
                    <span className="inline-block text-sm font-medium border-b border-white pb-1 transition-all duration-300 group-hover:border-jewelry-300">
                      Explore Collection
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-jewelry-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-jewelry-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our
              customers have to say about their Jhumkas by Mahira experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-jewelry-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-jewelry-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Jhumkas?
          </h2>
          <p className="text-lg text-jewelry-100 max-w-2xl mx-auto mb-8">
            Browse our collections and discover the perfect pair that speaks to
            your style.
          </p>
          <Link
            to="/collections"
            className="btn bg-white text-jewelry-600 hover:bg-jewelry-50"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
