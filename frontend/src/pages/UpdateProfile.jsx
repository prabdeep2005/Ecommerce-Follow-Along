import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../redux/actions/authActions';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    addresses: [{
      country: '',
      city: '',
      zipCode: '',
      address1: '',
      address2: '',
      addressType: 'Home',
    }],
  });
  
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        addresses: user.addresses?.length ? user.addresses : [{
          country: '',
          city: '',
          zipCode: '',
          address1: '',
          address2: '',
          addressType: 'Home',
        }],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['country', 'city', 'zipCode', 'address1', 'address2', 'addressType'].includes(name)) {
      setFormData({
        ...formData,
        addresses: formData.addresses.map((address, index) =>
          index === 0 ? { ...address, [name]: value } : address
        ),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfilePic(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'addresses') {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });
    
    if (profilePic) {
      data.append('avatar', profilePic);
    }

    try {
      await dispatch(updateUserProfile(data));
      toast.success('Profile updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Update Profile</h1>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-6 max-w-4xl mx-auto">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={formData.addresses[0].country} 
                    onChange={handleChange} 
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.addresses[0].city} 
                    onChange={handleChange} 
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    value={formData.addresses[0].zipCode} 
                    onChange={handleChange} 
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address Type</label>
                  <select 
                    name="addressType"
                    value={formData.addresses[0].addressType} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="address1"
                  value={formData.addresses[0].address1} 
                  onChange={handleChange} 
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2 (Optional)
                </label>
                <input 
                  type="text" 
                  name="address2"
                  value={formData.addresses[0].address2} 
                  onChange={handleChange} 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

           {/* Profile Picture Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="mt-2 flex items-center space-x-6">
                {/* Current Profile Picture */}
                {user?.avatar?.url && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Picture</p>
                    <img 
                      src={user.avatar.url} 
                      alt="Current Profile" 
                      className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
                    />
                  </div>
                )}
                
                {/* New Profile Picture Preview */}
                {profilePic && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">New Picture</p>
                    <img 
                      src={URL.createObjectURL(profilePic)} 
                      alt="Profile Preview" 
                      className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
              
              {/* File Input */}
              <input 
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button 
                type="submit" 
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-center mt-4">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}