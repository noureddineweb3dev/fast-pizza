import { createSlice } from '@reduxjs/toolkit';

// BROWSER ID - Always the same for this browser (for guests)
function getBrowserId() {
  let browserId = localStorage.getItem('browserId');
  if (!browserId) {
    browserId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('browserId', browserId);
  }
  return browserId;
}

// Get effective user identifier based on login state
// This function checks Redux state, but for initial load we need to check localStorage
function getEffectiveUserId(customerId = null) {
  if (customerId) {
    return `customer_${customerId}`;
  }
  return getBrowserId();
}

// Get storage key for the effective user
function getStorageKey(customerId = null) {
  const effectiveId = getEffectiveUserId(customerId);
  return `pizzaRatings_${effectiveId}`;
}

// LOCALSTORAGE HELPERS - User-specific storage

function loadRatingsFromStorage(customerId = null) {
  try {
    const storageKey = getStorageKey(customerId);
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

function saveRatingsToStorage(ratings, customerId = null) {
  try {
    const storageKey = getStorageKey(customerId);
    const serializedRatings = JSON.stringify(ratings);
    localStorage.setItem(storageKey, serializedRatings);
  } catch (err) {
    console.error('Error saving ratings to localStorage:', err);
  }
}

// Check if user is logged in from localStorage (for initial state)
function getInitialCustomerId() {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed?.id || null;
    }
  } catch (err) {
    console.error('Error reading user data:', err);
  }
  return null;
}

// INITIAL STATE
const initialCustomerId = getInitialCustomerId();

const initialState = {
  ratings: loadRatingsFromStorage(initialCustomerId),
  effectiveUserId: getEffectiveUserId(initialCustomerId),
  customerId: initialCustomerId,
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

      saveRatingsToStorage(state.ratings, state.customerId);
    },

    // Remove a rating
    removeRating(state, action) {
      const pizzaId = action.payload;
      delete state.ratings[pizzaId];
      saveRatingsToStorage(state.ratings, state.customerId);
    },

    // Clear all ratings for current user
    clearAllRatings(state) {
      state.ratings = {};
      saveRatingsToStorage(state.ratings, state.customerId);
    },

    // Switch user context (call on login/logout)
    switchUserContext(state, action) {
      const newCustomerId = action.payload; // null for guest, customer id for logged in user
      state.customerId = newCustomerId;
      state.effectiveUserId = getEffectiveUserId(newCustomerId);
      state.ratings = loadRatingsFromStorage(newCustomerId);
    },
  },
});

// EXPORTS

export const { addRating, removeRating, clearAllRatings, switchUserContext } = ratingSlice.actions;

export default ratingSlice.reducer;

// Helper to get the effective userId for API calls
export function getEffectiveUserIdForApi(customerId = null) {
  return getEffectiveUserId(customerId);
}

// Re-export getBrowserId for edge cases
export { getBrowserId };

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

// Get current effective userId
export const getCurrentUserId = (state) => state.rating.effectiveUserId;

// Get customer ID (null if guest)
export const getCustomerId = (state) => state.rating.customerId;
