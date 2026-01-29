import { createSlice } from '@reduxjs/toolkit';

// USER ID HELPER - Get or create a unique user identifier
function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// Get storage key for the current user
function getStorageKey() {
  const userId = getUserId();
  return `pizzaRatings_${userId}`;
}

// LOCALSTORAGE HELPERS - User-specific storage

function loadRatingsFromStorage() {
  try {
    const storageKey = getStorageKey();
    const serializedRatings = localStorage.getItem(storageKey);
    if (serializedRatings === null) {
      return {};
    }
    return JSON.parse(serializedRatings);
  } catch (err) {
    console.error('Error loading ratings from localStorage:', err);
    return {};
  }
}

function saveRatingsToStorage(ratings) {
  try {
    const storageKey = getStorageKey();
    const serializedRatings = JSON.stringify(ratings);
    localStorage.setItem(storageKey, serializedRatings);
  } catch (err) {
    console.error('Error saving ratings to localStorage:', err);
  }
}

// INITIAL STATE

const initialState = {
  ratings: loadRatingsFromStorage(),
  userId: getUserId(),
};

// RATING SLICE

const ratingSlice = createSlice({
  name: 'rating',
  initialState,

  reducers: {
    // Add or update a rating for a pizza
    addRating(state, action) {
      const { pizzaId, rating, review } = action.payload;

      state.ratings[pizzaId] = {
        rating,
        review: review || '',
        date: new Date().toISOString(),
      };

      saveRatingsToStorage(state.ratings);
    },

    // Remove a rating
    removeRating(state, action) {
      const pizzaId = action.payload;
      delete state.ratings[pizzaId];
      saveRatingsToStorage(state.ratings);
    },

    // Clear all ratings for current user
    clearAllRatings(state) {
      state.ratings = {};
      saveRatingsToStorage(state.ratings);
    },

    // Reload ratings for current user (call after user change)
    reloadUserRatings(state) {
      state.ratings = loadRatingsFromStorage();
      state.userId = getUserId();
    },
  },
});

// EXPORTS

export const { addRating, removeRating, clearAllRatings, reloadUserRatings } = ratingSlice.actions;

export default ratingSlice.reducer;

// Re-export getUserId for use in other components
export { getUserId };

// SELECTORS

// Get all ratings for current user
export const getAllRatings = (state) => state.rating.ratings;

// Get rating for specific pizza (current user only)
export const getPizzaRating = (pizzaId) => (state) => state.rating.ratings[pizzaId];

// Check if current user has rated a pizza
export const hasRatedPizza = (pizzaId) => (state) => !!state.rating.ratings[pizzaId];

// Get current user's average rating
export const getAverageRating = (state) => {
  const ratings = Object.values(state.rating.ratings);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
};

// Get total number of ratings by current user
export const getTotalRatingsCount = (state) => Object.keys(state.rating.ratings).length;

// Get current userId
export const getCurrentUserId = (state) => state.rating.userId;
