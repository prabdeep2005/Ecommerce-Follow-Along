import axios from 'axios';
import {
  productRequestStart,
  productRequestSuccess,
  productRequestFail
} from '../slices/productSlice';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true
});


// Get all products with filters
export const getProducts = (
    page = 1,
    category = '',
    minPrice = '',
    maxPrice = '',
    sort = ''
  ) => async (dispatch) => {
    try {
      dispatch(productRequestStart());
  
      let url = `/products?page=${page}`;
      if (category) url += `&category=${category}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (sort) url += `&sort=${sort}`;
  
      const { data } = await api.get(url);
  
      // Ensure products array has seller information
      const productsWithSeller = {
        ...data.data,
        products: data.data.products.map(product => ({
          ...product,
          seller: product.seller?._id || product.seller // handle both populated and unpopulated cases
        }))
      };
  
      dispatch(productRequestSuccess(productsWithSeller));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch(productRequestFail(message));
      throw error;
    }
  };

// Create new product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch(productRequestStart());

    const { data } = await api.post('/products/create', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    dispatch(getProducts()); // Refresh products list
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(productRequestFail(message));
    throw error;
  }
};

// Update product
export const updateProduct = (productId, productData) => async (dispatch) => {
  try {
    dispatch(productRequestStart());

    const { data } = await api.put(`/products/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    dispatch(getProducts()); // Refresh products list
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(productRequestFail(message));
    throw error;
  }
};

// Delete product
export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch(productRequestStart());

    const { data } = await api.delete(`/products/${productId}`);

    dispatch(getProducts()); // Refresh products list
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(productRequestFail(message));
    throw error;
  }
};

// Get single product
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch(productRequestStart());
    const { data } = await api.get(`/products/${id}`);
    dispatch(productRequestSuccess({ products: [data.data] }));
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(productRequestFail(message));
    throw error;
  }
};