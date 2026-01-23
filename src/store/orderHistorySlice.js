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
    // Add or update an order in history
    addOrderToHistory(state, action) {
      const orderData = action.payload;
      const index = state.orders.findIndex(o => o.id === orderData.id);

      if (index !== -1) {
        // Update existing order (sync status, etc.)
        state.orders[index] = {
          ...state.orders[index],
          ...orderData,
          // Keep the original date if possible
          date: state.orders[index].date || orderData.createdAt || new Date().toISOString()
        };
      } else {
        // Add new order
        const newOrder = {
          ...orderData,
          date: orderData.createdAt || new Date().toISOString(),
        };
        state.orders.unshift(newOrder);
      }

      // Keep only last 30 orders
      if (state.orders.length > 30) {
        state.orders = state.orders.slice(0, 30);
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
