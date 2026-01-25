import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ACTIVE_STATUS_IDS, COMPLETED_STATUS_IDS } from '../utils/orderStatuses';
import { loginAdmin as apiLoginAdmin, signup } from '../services/apiRestaurant';

// ASYNC THUNKS
export const loginAdmin = createAsyncThunk('admin/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const data = await apiLoginAdmin(username, password);
    localStorage.setItem('token', data.token); // Store token for API calls
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const signupAdmin = createAsyncThunk('admin/signup', async ({ fullName, email, password }, { rejectWithValue }) => {
  try {
    const data = await signup(fullName, email, password);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// LOCALSTORAGE HELPERS

function loadAdminDataFromStorage() {
  try {
    const serializedData = localStorage.getItem('adminData');
    if (serializedData === null) {
      return {
        isAuthenticated: !!localStorage.getItem('token'), // Check for token existence
        user: null, // Store user info (role, name)
        orders: [],
        stats: {
          totalOrders: 0,
          totalRevenue: 0,
          activeOrders: 0,
          completedOrders: 0,
        },
        status: 'idle',
        error: null,
      };
    }
    const data = JSON.parse(serializedData);
    data.isAuthenticated = !!localStorage.getItem('token'); // Always re-verify token presence
    // If not authenticated, clear user data just in case
    if (!data.isAuthenticated) data.user = null;
    return data;
  } catch (err) {
    console.error('Error loading admin data from localStorage:', err);
    return {
      isAuthenticated: false,
      user: null,
      orders: [],
      stats: { totalOrders: 0, totalRevenue: 0, activeOrders: 0, completedOrders: 0 },
      status: 'idle',
      error: null,
    };
  }
}

function saveAdminDataToStorage(data) {
  try {
    const { status, error, ...persistedData } = data; // Don't save transient UI state
    const serializedData = JSON.stringify(persistedData);
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
    // Admin logout
    adminLogout(state) {
      state.isAuthenticated = false;
      state.orders = [];
      localStorage.removeItem('token');
      localStorage.removeItem('adminData');
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
    // Sync all orders from backend
    setOrdersAdmin(state, action) {
      const orders = action.payload;
      state.orders = orders;

      // Recalculate stats
      state.stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
        activeOrders: orders.filter((o) => ACTIVE_STATUS_IDS.includes(o.status)).length,
        completedOrders: orders.filter((o) => COMPLETED_STATUS_IDS.includes(o.status)).length,
      };

      saveAdminDataToStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isAuthenticated = true; // Token is stored in localStorage by thunk
        state.isAuthenticated = true; // Token is stored in localStorage by thunk
        state.user = action.payload.data?.user || action.payload.user; // Handle both structures for safety
        saveAdminDataToStorage(state);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(signupAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupAdmin.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isAuthenticated = true;
        saveAdminDataToStorage(state);
      })
      .addCase(signupAdmin.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  }
});

// EXPORTS

export const {
  adminLogout,
  addOrderToAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
  setOrdersAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;

// SELECTORS

export const getIsAuthenticated = (state) => state.admin.isAuthenticated;
export const getAdminUser = (state) => state.admin.user;
export const getAdminOrders = (state) => state.admin.orders;
export const getAdminStats = (state) => state.admin.stats;

// Get orders by status
export const getOrdersByStatus = (status) => (state) =>
  state.admin.orders.filter((order) => order.status === status);

// Get active orders (all active statuses)
export const getActiveOrders = (state) =>
  state.admin.orders.filter((order) => ACTIVE_STATUS_IDS.includes(order.status));
