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
    // Submit a rating to the global system
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

export const { submitGlobalRating, removeGlobalRating } = globalRatingsSlice.actions;

export default globalRatingsSlice.reducer;

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
