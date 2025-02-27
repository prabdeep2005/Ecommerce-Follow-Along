import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Profile() {
  const { user } = useSelector(state => state.auth);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Header with Update Button */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Profile Details</h1>
              <Link
                to="/update-profile"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Update Profile
              </Link>
            </div>

            {/* Profile Content */}
            <div className="space-y-8">
              {/* Basic Info Section */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                    <img
                      src={user?.avatar?.url || 'https://via.placeholder.com/128'}
                      alt={user?.name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="text-lg text-gray-900">{user?.name || 'Not added'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-lg text-gray-900">{user?.email || 'Not added'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="text-lg text-gray-900">{user?.phoneNumber || 'Not added'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                      <p className="text-lg text-gray-900 capitalize">{user?.role || 'User'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Addresses</h2>
                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.addresses.map((address, index) => (
                      <div 
                        key={index}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                            {address.addressType}
                          </span>
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <p>{address.address1}</p>
                          {address.address2 && <p>{address.address2}</p>}
                          <p>{address.city}, {address.zipCode}</p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No addresses added</p>
                )}
              </div>

              {/* Account Actions */}
              <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Actions</h2>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/change-password"
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}