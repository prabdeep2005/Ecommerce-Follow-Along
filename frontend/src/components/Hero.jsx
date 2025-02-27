import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative py-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')] bg-repeat">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative container mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-white">Welcome to ShopX</h1>
        <p className="mt-4 text-lg text-gray-200">
          Discover amazing products curated just for you
        </p>
        <Link to="/products-page">
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md">
            Shop Now
          </button>
        </Link>
        
      </div>
    </section>
  );
}