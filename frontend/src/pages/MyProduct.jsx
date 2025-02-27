import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../redux/actions/productActions';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MyProducts() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.product);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(getProducts());
      } catch (error) {
        toast.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, [dispatch]);

  // Filter products to show only seller's products
  const myProducts = products.filter(product => 
    typeof product.seller === 'object' 
      ? product.seller._id === user._id 
      : product.seller === user._id
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add New Product
            </Link>
          </div>

          {error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : myProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products added yet.</p>
              <Link
                to="/dashboard"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map(product => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-gray-600 text-white text-center py-2 rounded-md hover:bg-gray-700 transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}