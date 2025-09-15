import React, { useState, useEffect } from 'react';
import { storeOwnerAPI } from '../../utils/api';
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const OwnerProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [ownerData, setOwnerData] = useState({
    name: '',
    email: '',
    address: '',
    role: 'STORE_OWNER'
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch owner profile data
  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        setLoading(true);
        // Get current user profile from localStorage
        const currentUser = JSON.parse(localStorage.getItem('trustify_user') || '{}');
        setOwnerData({
          name: currentUser.name || 'Store Owner',
          email: currentUser.email || 'owner@trustify.com',
          address: currentUser.address || 'Location not set',
          role: 'STORE_OWNER'
        });
      } catch (error) {
        setError('Failed to load profile data');
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long!' });
      return;
    }
    
    try {
      setLoading(true);
      await storeOwnerAPI.updatePassword(passwordData.oldPassword, passwordData.newPassword);
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading && !ownerData.name) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your store owner account settings</p>
        </div>
      </div>

      {/* Status Message */}
      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-purple-400 h-32"></div>
        <div className="relative px-6 pb-6">
          <div className="flex items-end -mt-12">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(ownerData.name)}
              </div>
            </div>
            <div className="ml-6 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">{ownerData.name}</h2>
              <p className="text-gray-600">{ownerData.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'profile', label: 'Profile Information', icon: <UserCircleIcon className="w-5 h-5" /> },
              { id: 'security', label: 'Security', icon: <LockClosedIcon className="w-5 h-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2 inline-flex">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <p className="text-gray-900 font-medium">{ownerData.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{ownerData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <span className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm px-3 py-1 rounded-full">
                    Store Owner
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <p className="text-gray-900">{ownerData.address}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Profile Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your profile information is managed by the system administrator. 
                        If you need to update your personal details, please contact support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              
              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>

              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Security Information</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Password Requirements</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Must be at least 8 characters long</li>
                          <li>Should contain uppercase and lowercase letters</li>
                          <li>Should include numbers and special characters</li>
                          <li>Avoid using common words or personal information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;