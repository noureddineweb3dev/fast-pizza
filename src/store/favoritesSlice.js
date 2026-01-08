import { createSlice } from '@reduxjs/toolkit';

// LOCALSTORAGE HELPERS

function loadFavoritesFromStorage() {
  try {
    const serializedFavorites = localStorage.getItem('favorites');
    if (serializedFavorites === null) {
      return [];
    }
    return JSON.parse(serializedFavorites);
  } catch (err) {
    console.error('Error loading favorites from localStorage:', err);
    return [];
  }
}

function saveFavoritesToStorage(favorites) {
  try {
    const serializedFavorites = JSON.stringify(favorites);
    localStorage.setItem('favorites', serializedFavorites);
  } catch (err) {
    console.error('Error saving favorites to localStorage:', err);
  }
}

// INITIAL STATE

const initialState = {
  favorites: loadFavoritesFromStorage(),
};

// FAVORITES SLICE

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,

  reducers: {
    // Add pizza to favorites
    addToFavorites(state, action) {
      const pizza = action.payload;

      // Check if already in favorites
      const exists = state.favorites.find((fav) => fav.id === pizza.id);

      if (!exists) {
        state.favorites.push({
          id: pizza.id,
          name: pizza.name,
          image: pizza.image,
          unitPrice: pizza.unitPrice,
          ingredients: pizza.ingredients,
          addedAt: new Date().toISOString(),
        });

        saveFavoritesToStorage(state.favorites);
      }
    },

    // Remove pizza from favorites
    removeFromFavorites(state, action) {
      const pizzaId = action.payload;
      state.favorites = state.favorites.filter((fav) => fav.id !== pizzaId);
      saveFavoritesToStorage(state.favorites);
    },

    // Toggle favorite
    toggleFavorite(state, action) {
      const pizza = action.payload;
      const index = state.favorites.findIndex((fav) => fav.id === pizza.id);

      if (index >= 0) {
        // Remove from favorites
        state.favorites.splice(index, 1);
      } else {
        // Add to favorites
        state.favorites.push({
          id: pizza.id,
          name: pizza.name,
          image: pizza.image,
          unitPrice: pizza.unitPrice,
          ingredients: pizza.ingredients,
          addedAt: new Date().toISOString(),
        });
      }

      saveFavoritesToStorage(state.favorites);
    },

    // Clear all favorites
    clearFavorites(state) {
      state.favorites = [];
      saveFavoritesToStorage(state.favorites);
    },
  },
});

// EXPORTS

export const { addToFavorites, removeFromFavorites, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;

// SELECTORS

// Get all favorites
export const getFavorites = (state) => state.favorites.favorites;

// Check if pizza is in favorites
export const isFavorite = (pizzaId) => (state) =>
  state.favorites.favorites.some((fav) => fav.id === pizzaId);

// Get favorites count
export const getFavoritesCount = (state) => state.favorites.favorites.length;

// Get favorite pizza IDs only
export const getFavoriteIds = (state) => state.favorites.favorites.map((fav) => fav.id);
