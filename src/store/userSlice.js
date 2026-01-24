import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, signup } from '../services/apiRestaurant';

// Async Thunks
export const loginUser = createAsyncThunk('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const signupUser = createAsyncThunk('user/signup', async ({ fullName, email, password }, { rejectWithValue }) => {
  try {
    const data = await signup(fullName, email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
  username: JSON.parse(localStorage.getItem('user'))?.full_name || '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.username = '';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.data.user;
        state.token = action.payload.token;
        state.username = action.payload.data.user.full_name;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.data.user;
        state.token = action.payload.token;
        state.username = action.payload.data.user.full_name;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  }
});

export const { updateName, logout, clearError } = userSlice.actions;

export const getUsername = (state) => state.user.username;
export const getUser = (state) => state.user.user;
export const getAuthStatus = (state) => state.user.status;
export const getAuthError = (state) => state.user.error;
export const getIsAuthenticated = (state) => !!state.user.token;

export default userSlice.reducer;
