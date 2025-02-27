import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, getCart } from '../redux/actions/cartActions';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  
  const isProductOwner = user?._id === (typeof product.seller === 'object' ? product.seller._id : product.seller);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      
      // If user is not authenticated, redirect to login
      if (!user) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }
  
      // Add to cart and handle the promise directly
      await dispatch(addToCart(product._id, 1));
      
      // Refresh cart after adding item
      await dispatch(getCart());
      
      toast.success('Product added to cart successfully');
      
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images[0]?.url || 'https://dummyimage.com/300x200/cccccc/000000&text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
            {product.name}
          </h2>
        </Link>
        
        <div className="mt-2 flex justify-between items-center">
          <p className="text-gray-600 font-bold">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            Stock: {product.stock}
          </p>
        </div>
        
        {/* Button Group */}
        <div className="mt-4 space-y-2">
          {/* Add to Cart Button - Visible to non-owners only */}
          {!isProductOwner && (
            <button 
              className={`w-full py-2 rounded-md transition-colors duration-300 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={handleAddToCart}
              disabled={loading || product.stock < 1}
            >
              {loading ? 'Adding...' : product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}

          {/* Edit Button - Only visible to product owner */}
          {isProductOwner && (
            <Link to={`/edit-product/${product._id}`} className="block">
              <button className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors duration-300">
                Edit Product
              </button>
            </Link>
          )}

          {/* View Details Button */}
          <Link to={`/product/${product._id}`} className="block">
            <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors duration-300">
              View Details
            </button>
          </Link>
        </div>

        {/* Product Category Badge */}
        <div className="mt-3">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}