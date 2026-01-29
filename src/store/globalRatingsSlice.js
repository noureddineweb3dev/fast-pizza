import { createSlice } from '@reduxjs/toolkit';

// LOCALSTORAGE HELPERS

function loadGlobalRatingsFromStorage() {
  try {
    const serializedRatings = localStorage.getItem('globalPizzaRatings');
    if (serializedRatings === null) {
      return {};
    }
    return JSON.parse(serializedRatings);
  } catch (err) {
    console.error('Error loading global ratings from localStorage:', err);
    return {};
  }
}

function saveGlobalRatingsToStorage(ratings) {
  try {
    const serializedRatings = JSON.stringify(ratings);
    localStorage.setItem('globalPizzaRatings', serializedRatings);
  } catch (err) {
    console.error('Error saving global ratings to localStorage:', err);
  }
}

// INITIAL STATE

const initialState = {
  ratings: loadGlobalRatingsFromStorage(),
};

// GLOBAL RATINGS SLICE

const globalRatingsSlice = createSlice({
  name: 'globalRatings',
  initialState,

  reducers: {
    // Submit a rating to the global system (Redux + localStorage)
    // Backend sync is handled separately via thunk
    submitGlobalRating(state, action) {
      const { pizzaId, rating, review, userId } = action.payload;

      // Initialize pizza ratings if doesn't exist
      if (!state.ratings[pizzaId]) {
        state.ratings[pizzaId] = {
          totalRating: 0,
          count: 0,
          average: 0,
          reviews: [],
        };
      }

      const pizzaRatings = state.ratings[pizzaId];

      // Check if user already rated this pizza
      const existingReviewIndex = pizzaRatings.reviews.findIndex((r) => r.userId === userId);

      if (existingReviewIndex >= 0) {
        // Update existing rating
        const oldRating = pizzaRatings.reviews[existingReviewIndex].rating;
        pizzaRatings.totalRating = pizzaRatings.totalRating - oldRating + rating;

        pizzaRatings.reviews[existingReviewIndex] = {
          userId,
          rating,
          review: review || '',
          date: new Date().toISOString(),
        };
      } else {
        // Add new rating
        pizzaRatings.totalRating += rating;
        pizzaRatings.count++;

        pizzaRatings.reviews.push({
          userId,
          rating,
          review: review || '',
          date: new Date().toISOString(),
        });
      }

      // Calculate average
      pizzaRatings.average = pizzaRatings.totalRating / pizzaRatings.count;

      saveGlobalRatingsToStorage(state.ratings);
    },

    // Set ratings from backend (for initial load/sync)
    setRatingsFromBackend(state, action) {
      const backendRatings = action.payload;
      // Merge backend ratings with local structure
      Object.keys(backendRatings).forEach(pizzaId => {
        const backendData = backendRatings[pizzaId];
        if (!state.ratings[pizzaId]) {
          state.ratings[pizzaId] = {
            totalRating: backendData.average * backendData.count,
            count: backendData.count,
            average: backendData.average,
            reviews: [],
          };
        } else {
          // Update with backend data (backend is source of truth for aggregates)
          state.ratings[pizzaId].average = backendData.average;
          state.ratings[pizzaId].count = backendData.count;
          state.ratings[pizzaId].totalRating = backendData.average * backendData.count;
        }
      });
      saveGlobalRatingsToStorage(state.ratings);
    },

    removeGlobalRating(state, action) {
      const { pizzaId, userId } = action.payload;

      if (state.ratings[pizzaId]) {
        const pizzaRatings = state.ratings[pizzaId];
        const reviewIndex = pizzaRatings.reviews.findIndex((r) => r.userId === userId);

        if (reviewIndex >= 0) {
          const removedRating = pizzaRatings.reviews[reviewIndex].rating;
          pizzaRatings.totalRating -= removedRating;
          pizzaRatings.count--;
          pizzaRatings.reviews.splice(reviewIndex, 1);

          if (pizzaRatings.count > 0) {
            pizzaRatings.average = pizzaRatings.totalRating / pizzaRatings.count;
          } else {
            // No more ratings, remove pizza entry
            delete state.ratings[pizzaId];
          }

          saveGlobalRatingsToStorage(state.ratings);
        }
      }
    },
  },
});

// EXPORTS

export const { submitGlobalRating, removeGlobalRating, setRatingsFromBackend } = globalRatingsSlice.actions;

export default globalRatingsSlice.reducer;

// ASYNC THUNKS (for backend syncing)
import { submitRating as apiSubmitRating, getAllRatings as apiFetchAllRatings } from '../services/apiRestaurant.js';

// Thunk to submit rating to backend and update Redux
export const submitRatingToBackend = (pizzaId, rating, review, userId, customerId) => async (dispatch) => {
  // Update local state immediately for responsive UI
  dispatch(submitGlobalRating({ pizzaId, rating, review, userId }));

  try {
    // Sync to backend (fire and forget, don't block UI)
    await apiSubmitRating(pizzaId, rating, review, userId, customerId);
  } catch (error) {
    console.error('Failed to sync rating to backend:', error);
    // Rating is still saved locally, will sync next time
  }
};

// Thunk to fetch all ratings from backend
export const fetchAllRatingsFromBackend = () => async (dispatch) => {
  try {
    const ratingsMap = await apiFetchAllRatings();
    dispatch(setRatingsFromBackend(ratingsMap));
  } catch (error) {
    console.error('Failed to fetch ratings from backend:', error);
    // Use local ratings as fallback
  }
};

// SELECTORS

// Get all global ratings
export const getAllGlobalRatings = (state) => state.globalRatings.ratings;

// Get rating info for specific pizza
export const getPizzaGlobalRating = (pizzaId) => (state) => state.globalRatings.ratings[pizzaId];

// Get average rating for pizza
export const getPizzaAverageRating = (pizzaId) => (state) =>
  state.globalRatings.ratings[pizzaId]?.average || 0;

// Get rating count for pizza
export const getPizzaRatingCount = (pizzaId) => (state) =>
  state.globalRatings.ratings[pizzaId]?.count || 0;

// Get all reviews for pizza
export const getPizzaReviews = (pizzaId) => (state) =>
  state.globalRatings.ratings[pizzaId]?.reviews || [];

// Get pizzas sorted by rating (for "most reviewed" or "top rated")
export const getPizzasByRating = (state) => {
  const ratings = state.globalRatings.ratings;

  return Object.entries(ratings)
    .map(([pizzaId, data]) => ({
      pizzaId: parseInt(pizzaId),
      average: data.average,
      count: data.count,
    }))
    .sort((a, b) => b.average - a.average); // Highest rating first
};

// Get most reviewed pizzas
export const getMostReviewedPizzas = (state) => {
  const ratings = state.globalRatings.ratings;

  return Object.entries(ratings)
    .map(([pizzaId, data]) => ({
      pizzaId: parseInt(pizzaId),
      average: data.average,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count) // Most reviews first
    .slice(0, 10); // Top 10
};
