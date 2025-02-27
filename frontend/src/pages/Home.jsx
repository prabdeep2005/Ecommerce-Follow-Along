import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div>
      <Header />
      <Hero />
      <ProductGrid />
      <Footer />
    </div>
  );
}