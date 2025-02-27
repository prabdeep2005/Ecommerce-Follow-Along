import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../redux/actions/productActions';
import { addToCart } from '../redux/actions/cartActions';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector(state => state.product);
  const { user } = useSelector(state => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        await dispatch(getProductDetails(id));
      } catch (error) {
        toast.error('Failed to fetch product details');
      }
    };
    fetchProduct();
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    try {
      if (!user) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }

      await dispatch(addToCart(id, quantity));
      toast.success('Product added to cart successfully');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
      </>
    );
  }

  if (error || !products[0]) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-red-600">Failed to load product details</p>
        </div>
      </>
    );
  }

  const product = products[0];
  const isProductOwner = user?._id === (typeof product.seller === 'object' ? product.seller._id : product.seller);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative aspect-square w-full max-h-[600px]">
                    <img
                    src={product.images[selectedImage]?.url || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                    />
                </div>
                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={image.public_id}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 
                          ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-2xl font-semibold text-blue-600">
                  ${product.price.toFixed(2)}
                </p>
                
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">Category</h2>
                  <p className="text-gray-600">{product.category}</p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">Seller Information</h2>
                  <p className="text-gray-600">{product.seller.name}</p>
                </div>

                {!isProductOwner && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label htmlFor="quantity" className="text-gray-700">Quantity:</label>
                      <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border rounded-md px-2 py-1"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}

                {isProductOwner && (
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition duration-200"
                  >
                    Edit Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}