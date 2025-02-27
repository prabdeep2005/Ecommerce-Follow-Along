import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCart, removeFromCart, updateCartQuantity } from '../redux/actions/cartActions';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          await dispatch(getCart());
        } catch (error) {
          toast.error('Failed to fetch cart');
        }
      }
    };
    fetchCart();
  }, [dispatch, isAuthenticated]);

  const handleRemoveFromCart = async (productId) => {
    try {
      await dispatch(removeFromCart(productId));
      // Refresh cart after removal to get updated state
      await dispatch(getCart());
      toast.success('Product removed from cart');
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return;
      }
      
      await dispatch(updateCartQuantity(productId, newQuantity));
      await dispatch(getCart()); // Refresh cart after update
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  // Calculate total only for valid products
  const totalPrice = items
    ?.filter(item => item?.product?._id && item?.product?.price)
    .reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0)
    .toFixed(2) || '0.00';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-xl">Loading cart...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <Link 
              to="/products-page" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    }

    // Filter out invalid items
    const validItems = items?.filter(item => item?.product?._id && item?.product?.name) || [];

    if (validItems.length === 0) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/products-page" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Shopping Cart ({validItems.length} items)</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <ul className="divide-y divide-gray-200">
              {validItems.map((item) => (
                <li key={item.product._id} className="py-6 flex">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-24 h-24">
                    <img
                      src={item.product.images[0]?.url || '/no-image.svg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/no-image.svg';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 sm:mt-0 flex items-center">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span className="mx-4 text-gray-600">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        className="p-2 text-gray-600 hover:text-gray-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleRemoveFromCart(item.product._id)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 sm:mt-0">
                      <p className="text-lg font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Cart Summary */}
            <div className="mt-8 border-t pt-8">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-gray-900">Subtotal</p>
                <p className="text-2xl font-semibold text-gray-900">${totalPrice}</p>
              </div>
              <button 
                className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200"
                onClick={() => toast.info('Checkout functionality coming soon!')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      {renderContent()}
      <Footer />
    </>
  );
}