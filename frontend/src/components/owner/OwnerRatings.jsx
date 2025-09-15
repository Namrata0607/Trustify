import React, { useState, useEffect } from 'react';
import { storeOwnerAPI } from '../../utils/api';
import { MagnifyingGlassIcon, ChevronUpDownIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const OwnerRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await storeOwnerAPI.getStoreRatings();
      setRatings(data.ratings || []);
      setStoreInfo({
        storeId: data.storeId,
        storeName: data.storeName
      });
    } catch (err) {
      setError('Failed to fetch ratings: ' + err.message);
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort ratings
  const filteredAndSortedRatings = ratings
    .filter(rating => {
      const searchLower = searchTerm.toLowerCase();
      return (
        rating.userName.toLowerCase().includes(searchLower) ||
        rating.userEmail.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'userName':
          aValue = a.userName.toLowerCase();
          bValue = b.userName.toLowerCase();
          break;
        case 'userEmail':
          aValue = a.userEmail.toLowerCase();
          bValue = b.userEmail.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      }
    }
    return stars;
  };

  // Calculate average rating
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading ratings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Ratings</h1>
          <p className="text-gray-600 mt-1">
            {storeInfo ? `Ratings for ${storeInfo.storeName}` : 'Manage customer ratings for your store'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-blue-800 text-lg font-semibold">Total Ratings</h3>
          <p className="text-blue-900 text-3xl font-bold">{ratings.length}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-yellow-800 text-lg font-semibold">Average Rating</h3>
          <p className="text-yellow-900 text-3xl font-bold">{averageRating}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-green-800 text-lg font-semibold">Happy Customers</h3>
          <p className="text-green-900 text-3xl font-bold">
            {ratings.filter(r => r.rating >= 4).length}
          </p>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => {
                  if (sortBy === 'userName') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('userName');
                    setSortOrder('asc');
                  }
                }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>User</span>
                  <ChevronUpDownIcon className="w-4 h-4" />
                </div>
              </th>
              <th 
                onClick={() => {
                  if (sortBy === 'userEmail') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('userEmail');
                    setSortOrder('asc');
                  }
                }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  <ChevronUpDownIcon className="w-4 h-4" />
                </div>
              </th>
              <th 
                onClick={() => {
                  if (sortBy === 'rating') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('rating');
                    setSortOrder('asc');
                  }
                }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Rating</span>
                  <ChevronUpDownIcon className="w-4 h-4" />
                </div>
              </th>
              <th 
                onClick={() => {
                  if (sortBy === 'createdAt') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('createdAt');
                    setSortOrder('asc');
                  }
                }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ChevronUpDownIcon className="w-4 h-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedRatings.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-1">No ratings found</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Your store hasn\'t received any ratings yet.'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredAndSortedRatings.map((rating, index) => (
                <tr key={`${rating.userId}-${index}`} className="hover:bg-gray-50">
                  {/* User Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {rating.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rating.userName}</div>
                        <div className="text-sm text-gray-500">User ID: {rating.userId}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Email Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{rating.userEmail}</div>
                  </td>
                  
                  {/* Rating Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-2">
                        {renderStars(rating.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{rating.rating}</span>
                    </div>
                  </td>
                  
                  {/* Date Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerRatings;