import React from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';

export default function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Discover Our Best Products
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Browse our exclusive collection of top-rated products. Find the best deals on electronics, accessories, and more.
        </p>
        <ProductGrid />
      </div>
    </div>
  );
}