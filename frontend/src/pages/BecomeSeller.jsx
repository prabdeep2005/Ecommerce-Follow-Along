import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { becomeSeller } from '../redux/actions/authActions';

export default function BecomeSeller() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(state => state.auth);
  const [isAgreed, setIsAgreed] = useState(false);
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (isAgreed) {
      try {
        await dispatch(becomeSeller());
        setSuccessMessage('Your request has been submitted!');
        setTimeout(()=> {
          navigate('/');
        }, 1000);
      } catch (error) {
        console.error('Become seller error:', error);
      }
    } else {
      alert('You must accept the agreement to proceed.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Become a Seller</h1>
          <p className="text-lg text-center text-gray-500">
            Join us and start selling your products to millions of customers.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                readOnly
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="agreement"
                type="checkbox"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={openModal}
                  className="text-blue-600 hover:underline"
                >
                  terms and conditions
                </button>
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-center mt-4">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="text-green-500 text-center mt-4">
                {successMessage}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
        >
          {/* Modal Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4 max-h-[80vh] flex flex-col">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 id="terms-title" className="text-2xl font-bold text-center mb-6">
              Terms and Conditions
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
              <p className="text-sm text-gray-600">
                <strong>1. Introduction:</strong> These terms and conditions govern your use of this website and services. By accessing or using our platform, you agree to abide by these terms.
              </p>
              <p className="text-sm text-gray-600">
                <strong>2. Eligibility:</strong> You must be at least 18 years old to become a seller. By submitting your request, you confirm that you meet the eligibility requirements.
              </p>
              <p className="text-sm text-gray-600">
                <strong>3. Account Responsibility:</strong> You are responsible for the security of your account and the information you provide. Any unauthorized activity within your account will be your responsibility.
              </p>
              <p className="text-sm text-gray-600">
                <strong>4. Seller Obligations:</strong> As a seller, you agree to provide accurate and truthful information about your products. You are responsible for the shipping and fulfillment of orders, as well as customer service.
              </p>
              <p className="text-sm text-gray-600">
                <strong>5. Prohibited Activities:</strong> You may not engage in any illegal, harmful, or fraudulent activities. This includes the sale of counterfeit products, intellectual property violations, or any actions that could harm our platform's reputation.
              </p>
              <p className="text-sm text-gray-600">
                <strong>6. Termination:</strong> We reserve the right to suspend or terminate your account if you violate any of these terms. You may also terminate your account at any time by contacting our support team.
              </p>
              <p className="text-sm text-gray-600">
                <strong>7. Limitation of Liability:</strong> Our platform is not liable for any damages that result from the use of our services. This includes direct, indirect, or consequential damages.
              </p>
              <p className="text-sm text-gray-600">
                <strong>8. Governing Law:</strong> These terms will be governed by and construed in accordance with the laws of the jurisdiction in which our company is based.
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}