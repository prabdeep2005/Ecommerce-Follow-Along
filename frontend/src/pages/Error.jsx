import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Error = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 Text with Animation */}
          <h1 className="text-9xl font-bold text-blue-600 animate-bounce">
            404
          </h1>
          
          {/* Error Message */}
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          {/* Action Buttons */}
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors duration-200 inline-block"
            >
              Home Page
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 space-y-4">
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-sm text-gray-500">
              Need help? <Link to="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Error;