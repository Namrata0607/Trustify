import React, { useState, useEffect } from 'react';
import { storeOwnerAPI } from '../../utils/api';
import { 
  BuildingStorefrontIcon, 
  StarIcon, 
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storeData, setStoreData] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch both store ratings and average rating
      const [ratingsData, avgRatingData] = await Promise.all([
        storeOwnerAPI.getStoreRatings(),
        storeOwnerAPI.getAverageRating()
      ]);

      setStoreData(ratingsData);
      setAverageRating(avgRatingData);
    } catch (err) {
      setError('Failed to fetch dashboard data: ' + err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {storeData?.storeName ? `Welcome to ${storeData.storeName}` : 'Manage your store ratings and performance'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Store Name Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Your Store</p>
              <p className="text-2xl font-bold truncate">
                {storeData?.storeName || 'Store Name'}
              </p>
            </div>
            <BuildingStorefrontIcon className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        {/* Average Rating Card */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold">
                  {averageRating?.averageRating ? averageRating.averageRating.toFixed(1) : 'N/A'}
                </p>
                <div className="flex space-x-1">
                  {renderStars(averageRating?.averageRating)}
                </div>
              </div>
            </div>
            <StarIcon className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        {/* Total Ratings Card */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Ratings</p>
              <p className="text-2xl font-bold">
                {averageRating?.totalRatings || 0}
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-green-200" />
          </div>
        </div>

        {/* Recent Ratings Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Users Rated</p>
              <p className="text-2xl font-bold">
                {storeData?.ratings?.length || 0}
              </p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Recent Ratings Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Ratings</h2>
          <p className="text-gray-600 text-sm">Latest customer feedback for your store</p>
        </div>

        <div className="p-6">
          {storeData?.ratings && storeData.ratings.length > 0 ? (
            <div className="space-y-2">
              {storeData.ratings.slice(0, 5).map((rating, index) => (
                <div key={index} className="border-b border-gray-200 flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {rating.userName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{rating.userName}</h4>
                      <p className="text-sm text-gray-500">{rating.userEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      {renderStars(rating.rating)}
                    </div>
                    <span className="font-medium text-gray-900">{rating.rating}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {storeData.ratings.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-gray-500 text-sm">
                    And {storeData.ratings.length - 5} more ratings...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <StarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h3>
              <p className="text-gray-500">
                Your store hasn't received any ratings yet. Encourage your customers to rate your store!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Store Information */}
      {storeData && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Store Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <p className="text-gray-900 font-medium">{storeData.storeName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store ID</label>
                <p className="text-gray-900">{storeData.storeId}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;