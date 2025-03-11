import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Check if product is already in cart
  const isInCart = cartItems.some((item) => item.id === Number(productId));
  const cartItem = cartItems.find((item) => item.id === Number(productId));

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Find the product by ID
    const foundProduct = products.find((p) => p.id === Number(productId));

    if (foundProduct) {
      setProduct(foundProduct);

      // Find related products (same category or similar price range)
      const similar = products
        .filter(
          (p) =>
            p.id !== foundProduct.id &&
            (p.name.includes(foundProduct.name.split(" ")[0]) ||
              Math.abs(p.price - foundProduct.price) < 2000)
        )
        .slice(0, 4);

      setRelatedProducts(similar);

      // Check if product is in wishlist
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsInWishlist(wishlist.some((item) => item.id === foundProduct.id));
    } else {
      // Product not found, redirect to products page
      navigate("/products");
    }
  }, [productId, products, navigate]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Add to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product));
      }
    }
  };

  const toggleWishlist = () => {
    if (!product) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsInWishlist(true);
    }

    // Dispatch custom event to notify other components about wishlist changes
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  if (!product) {
    return (
      <div className="container-custom mx-auto py-16 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jewelry-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm">
          <a href="/" className="text-gray-500 hover:text-jewelry-600">
            Home
          </a>
          <span className="mx-2 text-gray-400">/</span>
          <a href="/products" className="text-gray-500 hover:text-jewelry-600">
            Products
          </a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md transition-transform hover:scale-110"
                aria-label={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <i
                  className={`fas fa-heart ${
                    isInWishlist ? "text-red-500" : "text-gray-400"
                  }`}
                ></i>
              </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-serif font-bold text-jewelry-800 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <span className="text-gray-600">(4.5) · 24 Reviews</span>
              </div>

              <p className="text-2xl font-bold text-jewelry-600 mb-6">
                ₹{product.price.toFixed(2)}
              </p>

              <p className="text-gray-600 mb-6">
                Handcrafted with precision and care, this exquisite{" "}
                {product.name.toLowerCase()}
                showcases the finest craftsmanship and traditional design
                elements. Perfect for special occasions and everyday elegance.
              </p>

              <div className="border-t border-gray-100 pt-6 mb-6">
                <div className="flex items-center mb-6">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(Number(e.target.value))
                      }
                      className="w-12 text-center border-x border-gray-300"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`py-3 px-6 rounded-md font-medium flex-1 ${
                      isInCart
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-jewelry-600 text-white hover:bg-jewelry-700"
                    }`}
                  >
                    {isInCart
                      ? `Added to Cart (${cartItem?.quantity || 0})`
                      : "Add to Cart"}
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className="py-3 px-6 rounded-md font-medium border border-jewelry-600 text-jewelry-600 hover:bg-jewelry-50"
                  >
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <i className="fas fa-truck text-jewelry-600 mr-3"></i>
                    <span className="text-gray-700">
                      Free shipping on orders over ₹999
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-undo text-jewelry-600 mr-3"></i>
                    <span className="text-gray-700">30-day return policy</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-shield-alt text-jewelry-600 mr-3"></i>
                    <span className="text-gray-700">
                      Authenticity guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="border-t border-gray-100">
            <div className="flex border-b border-gray-100">
              <button
                className={`py-4 px-6 font-medium ${
                  activeTab === "description"
                    ? "text-jewelry-600 border-b-2 border-jewelry-600"
                    : "text-gray-500 hover:text-jewelry-600"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`py-4 px-6 font-medium ${
                  activeTab === "details"
                    ? "text-jewelry-600 border-b-2 border-jewelry-600"
                    : "text-gray-500 hover:text-jewelry-600"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`py-4 px-6 font-medium ${
                  activeTab === "reviews"
                    ? "text-jewelry-600 border-b-2 border-jewelry-600"
                    : "text-gray-500 hover:text-jewelry-600"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-lg font-medium text-jewelry-800 mb-4">
                    Product Description
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This beautiful {product.name.toLowerCase()} is a testament
                    to the rich heritage of Indian craftsmanship. Each piece is
                    meticulously handcrafted by skilled artisans, ensuring
                    exceptional quality and attention to detail.
                  </p>
                  <p className="text-gray-600 mb-4">
                    The design draws inspiration from traditional motifs while
                    incorporating contemporary elements, making it a versatile
                    addition to your jewelry collection. Whether paired with
                    ethnic attire for special occasions or worn with
                    contemporary outfits for a fusion look, this piece is sure
                    to make a statement.
                  </p>
                  <p className="text-gray-600">
                    Our jewelry is crafted using high-quality materials and
                    traditional techniques passed down through generations,
                    ensuring that each piece is not just an accessory but a work
                    of art that tells a story.
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div>
                  <h3 className="text-lg font-medium text-jewelry-800 mb-4">
                    Product Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Materials
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Premium quality metals</li>
                        <li>Ethically sourced gemstones</li>
                        <li>Handcrafted embellishments</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Dimensions
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Length: 5 cm</li>
                        <li>Width: 3 cm</li>
                        <li>Weight: 15 grams (approx.)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Care Instructions
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Store in a cool, dry place</li>
                        <li>Avoid contact with perfumes and chemicals</li>
                        <li>Clean with a soft, dry cloth</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Package Includes
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>1 pair of jhumkas</li>
                        <li>Elegant gift box</li>
                        <li>Authenticity certificate</li>
                        <li>Care instructions card</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-lg font-medium text-jewelry-800 mb-4">
                    Customer Reviews
                  </h3>
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                        </div>
                        <span className="font-medium text-gray-700">
                          Absolutely stunning!
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        These jhumkas are even more beautiful in person. The
                        craftsmanship is exceptional, and they're surprisingly
                        lightweight for their size. I've received so many
                        compliments!
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium">Priya S.</span>
                        <span className="mx-2">•</span>
                        <span>Verified Purchase</span>
                        <span className="mx-2">•</span>
                        <span>2 weeks ago</span>
                      </div>
                    </div>

                    <div className="border-b border-gray-100 pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="far fa-star"></i>
                        </div>
                        <span className="font-medium text-gray-700">
                          Beautiful design, great quality
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        I bought these for my sister's wedding and they were
                        perfect with her outfit. The details are intricate and
                        the quality is excellent. Taking off one star only
                        because the clasp is a bit difficult to use.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium">Anjali M.</span>
                        <span className="mx-2">•</span>
                        <span>Verified Purchase</span>
                        <span className="mx-2">•</span>
                        <span>1 month ago</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star-half-alt"></i>
                        </div>
                        <span className="font-medium text-gray-700">
                          Elegant and versatile
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        These jhumkas are the perfect balance of traditional and
                        modern. I've worn them with both Indian outfits and
                        western dresses, and they look amazing with both. The
                        packaging was also beautiful - would make a great gift!
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium">Meera K.</span>
                        <span className="mx-2">•</span>
                        <span>Verified Purchase</span>
                        <span className="mx-2">•</span>
                        <span>3 months ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-jewelry-800 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <a href={`/product/${relatedProduct.id}`} className="block">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-medium text-gray-800 mb-1 hover:text-jewelry-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-jewelry-600 font-bold">
                        ₹{relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
