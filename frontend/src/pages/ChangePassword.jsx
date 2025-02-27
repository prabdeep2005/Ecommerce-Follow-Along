import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { changePassword } from '../redux/actions/authActions';

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.auth);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
     // Basic validation
     if (!oldPassword.trim() || !newPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Password strength validation
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    try {
      await dispatch(changePassword(oldPassword, newPassword));
      setSuccessMessage('Password changed successfully!');
      toast.success('Password changed successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
      console.error('Change password error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Change Password</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="oldPassword" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label 
              htmlFor="newPassword" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}