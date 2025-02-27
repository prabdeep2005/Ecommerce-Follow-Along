import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cartRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    cartRequestSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.error = null;
    },
    cartRequestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCartErrors: (state) => {
      state.error = null;
    }
  }
});

export const {
  cartRequestStart,
  cartRequestSuccess,
  cartRequestFail,
  clearCartErrors
} = cartSlice.actions;

export default cartSlice.reducer;