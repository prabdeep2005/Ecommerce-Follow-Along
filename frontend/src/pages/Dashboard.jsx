import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../redux/actions/productActions';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.product);
  
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProduct(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate price is a positive number
      if (parseFloat(product.price) <= 0) {
        toast.error('Price must be greater than 0');
        return;
      }
  
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('category', product.category);
      formData.append('description', product.description);
      formData.append('images', product.image);
  
      // Remove .unwrap() and handle the response directly
      const response = await dispatch(createProduct(formData));
      
      if (response.type === 'product/productRequestFail') {
        throw new Error(response.payload);
      }
  
      toast.success('Product created successfully!');
      // Reset form
      setProduct({
        name: "",
        price: "",
        category: "",
        description: "",
        image: null,
      });
  
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create product');
    }
  };

  const categories = ["Electronics", "Wearables", "Accessories"];

  return (
    <>
      <Header />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-3xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Seller Dashboard</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Enter product name"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="Enter product price"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              minLength={10}
              rows="4"
              placeholder="Enter product description"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Product Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {product.image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(product.image)}
                  alt="Product Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-semibold rounded-md shadow-md transition`}
            >
              {loading ? 'Creating Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
}