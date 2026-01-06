import { createSlice } from '@reduxjs/toolkit';

// ============================================
// LOCALSTORAGE HELPERS
// ============================================

// Load cart from localStorage
function loadCartFromStorage() {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error('Error loading cart from localStorage:', err);
    return [];
  }
}

// Save cart to localStorage
function saveCartToStorage(cart) {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem('cart', serializedCart);
  } catch (err) {
    console.error('Error saving cart to localStorage:', err);
  }
}

// ============================================
// INITIAL STATE
// ============================================

// Load cart from localStorage on app start
const initialState = {
  cart: loadCartFromStorage(),
};

// ============================================
// CART SLICE
// ============================================

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    // Action: Add item to cart
    addItem(state, action) {
      const newItem = action.payload;

      const existingItem = state.cart.find((item) => item.pizzaId === newItem.pizzaId);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        state.cart.push({
          ...newItem,
          totalPrice: newItem.quantity * newItem.unitPrice,
        });
      }

      saveCartToStorage(state.cart);
    },

    // Action: Remove item completely from cart
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);

      saveCartToStorage(state.cart);
    },

    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.unitPrice;

        saveCartToStorage(state.cart);
      }
    },

    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      if (item) {
        item.quantity--;
        item.totalPrice = item.quantity * item.unitPrice;

        if (item.quantity === 0) {
          state.cart = state.cart.filter((i) => i.pizzaId !== action.payload);
        }

        saveCartToStorage(state.cart);
      }
    },

    // Action: Clear entire cart
    clearCart(state) {
      state.cart = [];

      saveCartToStorage(state.cart);
    },
  },
});

// ============================================
// EXPORTS
// ============================================

// Export actions
export const { addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

// ============================================
// SELECTORS
// ============================================

// Get entire cart
export const getCart = (state) => state.cart.cart;

// Get total cart quantity (total number of pizzas)
export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

// Get total cart price
export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

// Get quantity of a specific pizza by ID
export const getCurrentQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
