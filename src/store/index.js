// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice"; // Import the productSlice reducer
import cartReducer from "./cartSlice"; // Import cartSlice reducer if you have a cart reducer

const store = configureStore({
  reducer: {
    products: productReducer, // Changed from 'product' to 'products' to match usage in components
    cart: cartReducer, // The reducer for cart actions
  },
});

export default store;
