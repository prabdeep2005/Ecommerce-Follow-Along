import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
      state.error = null;
    },
    updateProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFail, 
  logout,
  updateProfile,
  updateProfileStart, 
  updateProfileSuccess,
  updateProfileFail 
} = authSlice.actions;

export default authSlice.reducer;