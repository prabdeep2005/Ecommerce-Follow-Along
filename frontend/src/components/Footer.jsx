import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} ShopX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}