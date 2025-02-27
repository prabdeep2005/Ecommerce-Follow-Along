import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    productRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    productRequestSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.error = null;
    },
    productRequestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    }
  }
});

export const {
  productRequestStart,
  productRequestSuccess,
  productRequestFail,
  clearErrors
} = productSlice.actions;

export default productSlice.reducer;