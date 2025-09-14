import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import RateStoreModal from './RateStoreModal';
import { userAPI } from '../../utils/api';

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useAuth();

  // Fetch user ratings
  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userAPI.getUserRatings(currentPage, itemsPerPage, searchTerm);
      
      // Check if the response has the expected structure
      if (response && response.ratings) {
        setRatings(response.ratings);
        // Set total pages from response pagination data
        setTotalPages(response.pagination.pages);
      } else {
        // Fallback for older API or testing
        setRatings(response || []);
        setTotalPages(Math.ceil((response?.length || 0) / itemsPerPage));
      }
    } catch (err) {
      setError('Failed to fetch ratings: ' + err.message);
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  };
         

     
  useEffect(() => {
    fetchRatings();
  }, [currentPage, itemsPerPage, searchTerm]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle edit rating
  const handleEditRating = (rating) => {
    console.log('Editing rating:', rating); // Debug log
    
    // Create a store object from the rating data
    const storeObj = {
      id: rating.storeId,
      name: rating.storeName,
      address: rating.storeAddress
    };
    
    setSelectedStore(storeObj);
    setSelectedRating(rating);
    setIsEditModalOpen(true);
  };

// Handle delete rating
const handleDeleteRating = async (rating) => {
    console.log('Deleting rating:', rating); // Debug log
    if (!window.confirm('Are you sure you want to delete this rating?')) {
        return;
    }
    try {
        // We already have the full rating object, so no need to find it
        const storeId = rating.storeId;
        
        console.log('Deleting rating for store ID:', storeId); // Debug log
        
        // Make the actual API call to delete the rating
        await userAPI.deleteRating(storeId);
        
        // Refresh ratings from server instead of updating local state
        await fetchRatings();
        
    } catch (error) {
        console.error('Error deleting rating:', error);
        alert('Failed to delete rating. Please try again.');
    }
};

  // Handle submit rating update
  const handleSubmitRatingUpdate = async (storeId, newRating) => {
    try {
      // Make the actual API call to update the rating
      await userAPI.rateStore(storeId, newRating);
      
      // Update local state to reflect the change
      setRatings(ratings.map(r => {
        if (r.id === selectedRating.id) {
          return {
            ...r,
            rating: newRating,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      }));

      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Failed to update rating. Please try again.');
    }
  };

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
        <p className="text-gray-600 mt-2">View and manage your store ratings</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your ratings...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {ratings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <StarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h3>
              <p className="text-gray-600 mb-6">You haven't rated any stores yet.</p>
              <button 
                onClick={() => window.location.href = '/user'} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Stores
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Store
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Your Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Rated
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th> */}
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ratings.map((rating) => (
                    <tr key={rating.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {rating.storeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{rating.storeName}</div>
                            <div className="text-sm text-gray-500">{rating.storeAddress}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(rating.rating)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(rating.createdAt)}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(rating.updatedAt)}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => handleEditRating(rating)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Edit rating"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRating(rating)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Delete rating"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Rating Modal */}
      {selectedRating && (
        <RateStoreModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          store={selectedStore}
          existingRating={selectedRating.rating}
          onSubmit={handleSubmitRatingUpdate}
        />
      )}
    </div>
  );
};

export default UserRatings;