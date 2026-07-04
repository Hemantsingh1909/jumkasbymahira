import { createSlice } from "@reduxjs/toolkit";

// Initial state for products
const initialState = {
  products: [],
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
