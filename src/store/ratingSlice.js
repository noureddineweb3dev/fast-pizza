import { createSlice } from '@reduxjs/toolkit';

// LOCALSTORAGE HELPERS

function loadRatingsFromStorage() {
  try {
    const serializedRatings = localStorage.getItem('pizzaRatings');
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
    const serializedRatings = JSON.stringify(ratings);
    localStorage.setItem('pizzaRatings', serializedRatings);
  } catch (err) {
    console.error('Error saving ratings to localStorage:', err);
  }
}

// INITIAL STATE

const initialState = {
  ratings: loadRatingsFromStorage(),
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

    // Clear all ratings
    clearAllRatings(state) {
      state.ratings = {};
      saveRatingsToStorage(state.ratings);
    },
  },
});

// EXPORTS

export const { addRating, removeRating, clearAllRatings } = ratingSlice.actions;

export default ratingSlice.reducer;

// SELECTORS

// Get all ratings
export const getAllRatings = (state) => state.rating.ratings;

// Get rating for specific pizza
export const getPizzaRating = (pizzaId) => (state) => state.rating.ratings[pizzaId];

// Check if user has rated a pizza
export const hasRatedPizza = (pizzaId) => (state) => !!state.rating.ratings[pizzaId];

// Get average rating
export const getAverageRating = (state) => {
  const ratings = Object.values(state.rating.ratings);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
};

// Get total number of ratings
export const getTotalRatingsCount = (state) => Object.keys(state.rating.ratings).length;
