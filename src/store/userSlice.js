import { createSlice } from '@reduxjs/toolkit';

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  username: '',
};

// ============================================
// USER SLICE
// ============================================

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    // Action: Update username
    updateName(state, action) {
      state.username = action.payload;
    },
  },
});

// ============================================
// EXPORTS
// ============================================

export const { updateName } = userSlice.actions;

export default userSlice.reducer;

// ============================================
// SELECTORS
// ============================================

export const getUsername = (state) => state.user.username;
