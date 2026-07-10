import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage if available
const loadCartFromStorage = () => {
  try {
    if (typeof window !== "undefined" && localStorage) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return { items: [] };
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    if (typeof window !== "undefined" && localStorage) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state);
    },
    incrementItem: (state, action) => {
      const target = action.payload;
      const isObj = target && typeof target === 'object';
      const id = isObj ? target.id : target;
      const size = isObj ? target.selectedSize : undefined;
      const item = state.items.find(
        (item) => item.id === id && item.selectedSize === size
      );
      if (item) {
        item.quantity += 1;
      }
      saveCartToStorage(state);
    },
    decrementItem: (state, action) => {
      const target = action.payload;
      const isObj = target && typeof target === 'object';
      const id = isObj ? target.id : target;
      const size = isObj ? target.selectedSize : undefined;
      const item = state.items.find(
        (item) => item.id === id && item.selectedSize === size
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      saveCartToStorage(state);
    },
    removeItem: (state, action) => {
      const target = action.payload;
      const isObj = target && typeof target === 'object';
      const id = isObj ? target.id : target;
      const size = isObj ? target.selectedSize : undefined;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.selectedSize === size)
      );
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state);
    },
  },
});

export const {
  addToCart,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
