import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import orderHistoryReducer from './orderHistorySlice';
import ratingReducer from './ratingSlice';
import favoritesReducer from './favoritesSlice';
import adminReducer from './adminSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    orderHistory: orderHistoryReducer,
    rating: ratingReducer,
    favorites: favoritesReducer,
    admin: adminReducer,
  },
});

export default store;
