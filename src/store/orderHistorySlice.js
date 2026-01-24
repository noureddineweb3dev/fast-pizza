import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyOrders } from '../services/apiRestaurant';

// ASYNC THUNKS

export const fetchOrderHistory = createAsyncThunk(
  'orderHistory/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getMyOrders();
      return orders;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// INITIAL STATE

const initialState = {
  orders: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ORDER HISTORY SLICE

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,

  reducers: {
    // Optimistically add an order (fallback if re-fetch is slow)
    addOrderToHistory(state, action) {
      state.orders.unshift(action.payload);
      // Keep only last 50 orders
      if (state.orders.length > 50) {
        state.orders.pop();
      }
    },

    clearOrderHistory(state) {
      state.orders = [];
      state.status = 'idle';
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload; // Replace with source of truth from DB
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// EXPORTS

export const { addOrderToHistory, clearOrderHistory } = orderHistorySlice.actions;

export default orderHistorySlice.reducer;

// SELECTORS

export const getAllOrders = (state) => state.orderHistory.orders;
export const getOrderHistoryStatus = (state) => state.orderHistory.status;
export const getOrderHistoryError = (state) => state.orderHistory.error;

export const getRecentOrders = (state) => state.orderHistory.orders.slice(0, 5);
export const getTotalOrdersCount = (state) => state.orderHistory.orders.length;
