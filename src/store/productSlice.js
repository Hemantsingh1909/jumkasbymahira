import { createSlice } from "@reduxjs/toolkit";

// Initial state for products
const initialState = {
  products: [
    // Initial products with prices in rupees
    {
      id: 1,
      name: "Gold Jhumka",
      image: "/src/assets/one.jpeg",
      price: 12999.99,
    },
    {
      id: 2,
      name: "Pearl Earrings",
      image: "/src/assets/two.jpeg",
      price: 8499.5,
    },
    {
      id: 3,
      name: "Diamond Studs",
      image: "/src/assets/three.jpeg",
      price: 24999.99,
    },
    {
      id: 4,
      name: "Ruby Danglers",
      image: "/src/assets/four.jpeg",
      price: 15999.99,
    },
    {
      id: 5,
      name: "Emerald Drops",
      image: "/src/assets/five.jpeg",
      price: 18499.5,
    },
    {
      id: 6,
      name: "Silver Hoops",
      image: "/src/assets/six.jpeg",
      price: 5999.99,
    },
    {
      id: 7,
      name: "Kundan Jhumka",
      image: "/src/assets/seven.jpeg",
      price: 9999.99,
    },
    {
      id: 8,
      name: "Antique Chandbali",
      image: "/src/assets/eight.jpeg",
      price: 11499.5,
    },
    {
      id: 9,
      name: "Meenakari Earrings",
      image: "/src/assets/nine.jpeg",
      price: 7999.99,
    },
    {
      id: 10,
      name: "Crystal Danglers",
      image: "/src/assets/ten.jpeg",
      price: 6499.99,
    },
  ],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Action to set the products list
    setProducts(state, action) {
      state.products = action.payload;
    },

    // Action to add a product to the products list
    addProduct(state, action) {
      state.products.push(action.payload);
    },

    // Action to remove a product from the products list
    removeProduct(state, action) {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },

    // Action to update a product in the products list
    updateProduct(state, action) {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    // Action for setting loading state
    setLoading(state, action) {
      state.loading = action.payload;
    },

    // Action for setting error state
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

// Export the actions to be used in components
export const {
  setProducts,
  addProduct,
  removeProduct,
  updateProduct,
  setLoading,
  setError,
} = productSlice.actions;

// Selectors to get products, loading, and error from the state
export const selectProducts = (state) => state.products.products;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;

// Export the reducer to be used in store configuration
export default productSlice.reducer;
