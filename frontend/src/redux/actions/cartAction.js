import axios from 'axios';
import {
  cartRequestStart,
  cartRequestSuccess,
  cartRequestFail
} from '../slices/cartSlice';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true
});

// Get cart contents
export const getCart = () => async (dispatch) => {
  try {
    dispatch(cartRequestStart());
    const { data } = await api.get('/cart');
    dispatch(cartRequestSuccess(data.data.items));
    return data;
  } catch (error) {
    // Return empty cart on 404
    if (error.response?.status === 404) {
      dispatch(cartRequestSuccess([])); // Use cartRequestSuccess instead of direct type
      return;
    }
    const message = error.response?.data?.message || error.message;
    dispatch(cartRequestFail(message));
    throw error;
  }
};

// Add to cart
export const addToCart = (productId, quantity) => async (dispatch) => {
  try {
    dispatch(cartRequestStart());
    const { data } = await api.post('/cart/add', { productId, quantity });
    dispatch(cartRequestSuccess(data.data.items));
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(cartRequestFail(message));
    throw error;
  }
};

// Remove from cart
export const removeFromCart = (productId) => async (dispatch) => {
    try {
      dispatch(cartRequestStart());
      const { data } = await api.delete('/cart/remove', {
        data: { productId }  // Send productId in request body
      });
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to remove item from cart');
      }
      
      dispatch(cartRequestSuccess(data.data.items));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch(cartRequestFail(message));
      throw error;
    }
  };

// Update cart quantity
// Update cart quantity
export const updateCartQuantity = (productId, quantity) => async (dispatch) => {
    try {
      dispatch(cartRequestStart());
      const { data } = await api.patch('/cart/update', { productId, quantity });
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update cart');
      }
      
      dispatch(cartRequestSuccess(data.data.items));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch(cartRequestFail(message));
      throw error;
    }
  };