import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import orderHistoryReducer from './orderHistorySlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    orderHistory: orderHistoryReducer,
  },
});

export default store;
