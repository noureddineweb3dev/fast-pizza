import { createSlice } from '@reduxjs/toolkit';
import { ACTIVE_STATUS_IDS, COMPLETED_STATUS_IDS } from '../utils/orderStatuses';

// LOCALSTORAGE HELPERS

function loadAdminDataFromStorage() {
  try {
    const serializedData = localStorage.getItem('adminData');
    if (serializedData === null) {
      return {
        isAuthenticated: false,
        orders: [],
        stats: {
          totalOrders: 0,
          totalRevenue: 0,
          activeOrders: 0,
          completedOrders: 0,
        },
      };
    }
    return JSON.parse(serializedData);
  } catch (err) {
    console.error('Error loading admin data from localStorage:', err);
    return {
      isAuthenticated: false,
      orders: [],
      stats: { totalOrders: 0, totalRevenue: 0, activeOrders: 0, completedOrders: 0 },
    };
  }
}

function saveAdminDataToStorage(data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem('adminData', serializedData);
  } catch (err) {
    console.error('Error saving admin data to localStorage:', err);
  }
}

const initialState = loadAdminDataFromStorage();

// ADMIN SLICE

const adminSlice = createSlice({
  name: 'admin',
  initialState,

  reducers: {
    adminLogin(state, action) {
      const { password } = action.payload;

      if (password === 'admin123') {
        state.isAuthenticated = true;
        saveAdminDataToStorage(state);
      }
    },

    // Admin logout
    adminLogout(state) {
      state.isAuthenticated = false;
      saveAdminDataToStorage(state);
    },

    // Add order to admin dashboard
    addOrderToAdmin(state, action) {
      const order = action.payload;

      const exists = state.orders.find((o) => o.id === order.id);
      if (!exists) {
        state.orders.unshift({
          ...order,
          adminAddedAt: new Date().toISOString(),
        });

        state.stats.totalOrders++;
        state.stats.totalRevenue += order.totalPrice;

        if (ACTIVE_STATUS_IDS.includes(order.status)) {
          state.stats.activeOrders++;
        } else if (COMPLETED_STATUS_IDS.includes(order.status)) {
          state.stats.completedOrders++;
        }

        saveAdminDataToStorage(state);
      }
    },

    // Update order status
    updateOrderStatusAdmin(state, action) {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);

      if (order) {
        const oldStatus = order.status;
        order.status = status;
        order.lastUpdated = new Date().toISOString();

        // Update stats
        if (ACTIVE_STATUS_IDS.includes(oldStatus)) {
          state.stats.activeOrders--;
        } else if (COMPLETED_STATUS_IDS.includes(oldStatus)) {
          state.stats.completedOrders--;
        }

        if (ACTIVE_STATUS_IDS.includes(status)) {
          state.stats.activeOrders++;
        } else if (COMPLETED_STATUS_IDS.includes(status)) {
          state.stats.completedOrders++;
        }

        saveAdminDataToStorage(state);
      }
    },

    // Delete order
    deleteOrderAdmin(state, action) {
      const orderId = action.payload;
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);

      if (orderIndex >= 0) {
        const order = state.orders[orderIndex];

        state.stats.totalOrders--;
        state.stats.totalRevenue -= order.totalPrice;

        if (ACTIVE_STATUS_IDS.includes(order.status)) {
          state.stats.activeOrders--;
        } else if (COMPLETED_STATUS_IDS.includes(order.status)) {
          state.stats.completedOrders--;
        }

        state.orders.splice(orderIndex, 1);
        saveAdminDataToStorage(state);
      }
    },
  },
});

// EXPORTS

export const {
  adminLogin,
  adminLogout,
  addOrderToAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;

// SELECTORS

export const getIsAuthenticated = (state) => state.admin.isAuthenticated;
export const getAdminOrders = (state) => state.admin.orders;
export const getAdminStats = (state) => state.admin.stats;

// Get orders by status
export const getOrdersByStatus = (status) => (state) =>
  state.admin.orders.filter((order) => order.status === status);

// Get active orders (all active statuses)
export const getActiveOrders = (state) =>
  state.admin.orders.filter((order) => ACTIVE_STATUS_IDS.includes(order.status));
