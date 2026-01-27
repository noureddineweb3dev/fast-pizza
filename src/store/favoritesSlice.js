import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFavorites, apiAddFavorite, apiRemoveFavorite } from '../services/apiRestaurant';
import toast from 'react-hot-toast';

// LOCALSTORAGE HELPERS
function loadFavoritesFromStorage() {
  try {
    const serializedFavorites = localStorage.getItem('favorites');
    return serializedFavorites ? JSON.parse(serializedFavorites) : [];
  } catch (err) {
    console.error('Error loading favorites from localStorage:', err);
    return [];
  }
}

function saveFavoritesToStorage(favorites) {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (err) {
    console.error('Error saving favorites to localStorage:', err);
  }
}

// ASYNC THUNKS

export const fetchUserFavorites = createAsyncThunk(
  'favorites/fetchUserFavorites',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (token) {
        // Authenticated: Fetch from API
        return await fetchFavorites();
      } else {
        // Guest: Fetch from LocalStorage
        return loadFavoritesFromStorage();
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavorite',
  async (pizza, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token;
      const favorites = state.favorites.favorites;
      const exists = favorites.find((fav) => fav.id === pizza.id);

      if (token) {
        // Authenticated: API Interaction
        if (exists) {
          await apiRemoveFavorite(pizza.id);
          return { type: 'remove', id: pizza.id };
        } else {
          const newFav = await apiAddFavorite(pizza.id);
          return { type: 'add', item: newFav };
        }
      } else {
        // Guest: LocalStorage Interaction
        let newFavorites;
        if (exists) {
          newFavorites = favorites.filter((fav) => fav.id !== pizza.id);
        } else {
          newFavorites = [...favorites, { ...pizza, addedAt: new Date().toISOString() }];
        }
        saveFavoritesToStorage(newFavorites);
        return { type: 'local', favorites: newFavorites };
      }
    } catch (err) {
      toast.error('Failed to update favorites');
      return rejectWithValue(err.message);
    }
  }
);

export const clearFavoritesAsync = createAsyncThunk(
  'favorites/clearFavorites',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const token = state.user.token;

    if (token) {
      const ids = state.favorites.favorites.map(f => f.id);
      await Promise.all(ids.map(id => apiRemoveFavorite(id)));
      return [];
    } else {
      localStorage.removeItem('favorites');
      return [];
    }
  }
);


const initialState = {
  favorites: loadFavoritesFromStorage(), // Initial load for guests
  status: 'idle',
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.favorites = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload) state.favorites = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      // Toggle
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const { type, item, id, favorites } = action.payload;
        if (type === 'local') {
          state.favorites = favorites;
        } else if (type === 'add') {
          state.favorites.push(item);
        } else if (type === 'remove') {
          state.favorites = state.favorites.filter(f => f.id !== id);
        }
      })
      // Clear
      .addCase(clearFavoritesAsync.fulfilled, (state) => {
        state.favorites = [];
      });
  },
});

export const { setFavorites } = favoritesSlice.actions;

export const getFavorites = (state) => state.favorites.favorites;
export const getFavoritesStatus = (state) => state.favorites.status;
export const isFavorite = (pizzaId) => (state) =>
  state.favorites.favorites.some((fav) => fav.id === pizzaId);

export default favoritesSlice.reducer;
