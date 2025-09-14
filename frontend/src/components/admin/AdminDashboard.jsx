import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../utils/api';
import { BuildingStorefrontIcon, UserGroupIcon, StarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    users: 0,
    stores: 0,
    ratings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Fetch dashboard analytics on component mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getDashboardAnalytics();
        setAnalytics(data);
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard analytics:', err);
        setError('Failed to load dashboard analytics');
        // Keep default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const recentActivities = [
    {
      id: 1,
      type: 'new_user',
      user: 'Namrata Daphale',
      email: 'namr07@gmail.com',
      action: 'New User Created',
      rating: 4.5,
      time: '2 hours ago',
      icon: '👤'
    },
    {
      id: 2,
      type: 'new_store',
      user: 'John Doe',
      email: 'john@example.com',
      action: 'New Store Added - Pantloons',
      rating: null,
      time: '5 hours ago',
      icon: '🏪',
      isNew: true
    },
    {
      id: 3,
      type: 'new_rating',
      user: 'Namrata Daphale',
      email: 'namr07@gmail.com',
      action: 'New Rating Submitted',
      rating: 4.5,
      time: '1 day ago',
      icon: '⭐'
    },
    {
      id: 4,
      type: 'password_change',
      user: 'Alice Smith',
      email: 'alice@example.com',
      action: 'Password Changed',
      rating: null,
      time: '2 days ago',
      icon: '🔐'
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="w-4 h-4 text-gray-300" />
          )
        ))}
        <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome Owner {user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening in your platform today.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Analytics Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Total Analytics</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-2xl animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stores Card */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl border border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-medium text-sm uppercase tracking-wide">Stores</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{formatNumber(analytics.stores)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl border border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 font-medium text-sm uppercase tracking-wide">Users</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{formatNumber(analytics.users)}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Ratings Card */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl border border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 font-medium text-sm uppercase tracking-wide">Ratings</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{formatNumber(analytics.ratings)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Profile Picture */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  {/* Activity Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{activity.user}</h4>
                      {activity.isNew && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{activity.email}</p>
                    <p className="text-sm text-gray-800 mt-1">{activity.action}</p>
                  </div>
                </div>

                {/* Rating and Time */}
                <div className="text-right">
                  {activity.rating && (
                    <div className="mb-2">
                      {renderStars(activity.rating)}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            View All Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;