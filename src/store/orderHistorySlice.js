import { createSlice } from '@reduxjs/toolkit';

// LOCALSTORAGE HELPERS

function loadOrdersFromStorage() {
  try {
    const serializedOrders = localStorage.getItem('orderHistory');
    if (serializedOrders === null) {
      return [];
    }
    return JSON.parse(serializedOrders);
  } catch (err) {
    console.error('Error loading orders from localStorage:', err);
    return [];
  }
}

function saveOrdersToStorage(orders) {
  try {
    const serializedOrders = JSON.stringify(orders);
    localStorage.setItem('orderHistory', serializedOrders);
  } catch (err) {
    console.error('Error saving orders to localStorage:', err);
  }
}

// INITIAL STATE

const initialState = {
  orders: loadOrdersFromStorage(),
};

// ORDER HISTORY SLICE

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,

  reducers: {
    // Add a new order to history
    addOrderToHistory(state, action) {
      const newOrder = {
        ...action.payload,
        date: new Date().toISOString(),
      };

      state.orders.unshift(newOrder);

      // Keep only last 20 orders
      if (state.orders.length > 20) {
        state.orders = state.orders.slice(0, 20);
      }

      saveOrdersToStorage(state.orders);
    },

    // Update order status (when tracking order)
    updateOrderStatus(state, action) {
      const { id, status } = action.payload;
      const order = state.orders.find((order) => order.id === id);

      if (order) {
        order.status = status;
        saveOrdersToStorage(state.orders);
      }
    },

    // Clear all order history
    clearOrderHistory(state) {
      state.orders = [];
      saveOrdersToStorage(state.orders);
    },
  },
});

// EXPORTS

export const { addOrderToHistory, updateOrderStatus, clearOrderHistory } =
  orderHistorySlice.actions;

export default orderHistorySlice.reducer;

// SELECTORS

// Get all orders
export const getAllOrders = (state) => state.orderHistory.orders;

// Get recent orders (last 5)
export const getRecentOrders = (state) => state.orderHistory.orders.slice(0, 5);

// Get order by ID
export const getOrderById = (id) => (state) =>
  state.orderHistory.orders.find((order) => order.id === id);

// Get total orders count
export const getTotalOrdersCount = (state) => state.orderHistory.orders.length;
