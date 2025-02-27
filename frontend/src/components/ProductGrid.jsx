import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../redux/actions/productActions';
import ProductCard from './ProductCard';

const categories = ["All", "Electronics", "Wearables", "Accessories"];

export default function ProductGrid() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading, error } = useSelector(state => state.product);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(getProducts(1, selectedCategory !== "All" ? selectedCategory : ""));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    
    fetchProducts();
  }, [dispatch, selectedCategory]);

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery ? 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = selectedCategory === "All" ? 
      true : 
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h2>
          <select
            className="border px-3 py-2 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-600">
                {searchQuery ? 'No products found matching your search.' : 'No products found.'}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}