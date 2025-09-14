import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StoreCard from './StoreCard';
import RateStoreModal from './RateStoreModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { userAPI } from '../../utils/api';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  const { user } = useAuth();
  const storesPerPage = 8;

  // Fetch stores from API
  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await userAPI.getStores(currentPage, storesPerPage, searchTerm);
      
      // Check if the response has the expected structure
      if (response && response.stores) {
        setStores(response.stores);
        // Set total pages from response pagination data
        setTotalPages(response.pagination.pages);
      } else {
        // Fallback for older API or testing
        setStores(response || []);
        setTotalPages(Math.ceil((response?.length || 0) / storesPerPage));
      }
    } catch (err) {
      setError('Failed to fetch stores: ' + err.message);
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [currentPage, storesPerPage, searchTerm]);

  // Handle store rating
  const handleRateStore = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    setSelectedStore(store);
    setExistingRating(store.userRating);
    setIsRateModalOpen(true);
  };

  // Handle edit rating
  const handleEditRating = (storeId, userRating) => {
    const store = stores.find(s => s.id === storeId);
    setSelectedStore(store);
    setExistingRating(userRating);
    setIsRateModalOpen(true);
  };

  // Handle submit rating
  const handleSubmitRating = async (storeId, rating) => {
    try {
      await userAPI.rateStore(storeId, rating);
      
      // Update local state to reflect the change
      setStores(stores.map(store => {
        if (store.id === storeId) {
          return {
            ...store,
            userRating: rating
          };
        }
        return store;
      }));

      setIsRateModalOpen(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  // Filter stores based on search term (if not using API filtering)
  const getFilteredStores = () => {
    if (!Array.isArray(stores)) {
      return [];
    }
    
    if (!searchTerm) {
      return stores;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return stores.filter(store => 
      store.name.toLowerCase().includes(searchLower) || 
      store.address.toLowerCase().includes(searchLower)
    );
  };

  const filteredStores = getFilteredStores();

  // Paginate stores
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * storesPerPage,
    currentPage * storesPerPage
  );

  // Generate pagination controls
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredStores.length / storesPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-8">
        <nav className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Stores</h1>
          <p className="text-gray-600 mt-2">Discover and rate stores in your community</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading stores...</span>
        </div>
      ) : (
        <>
          {/* Store Grid */}
          {paginatedStores.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `No stores matching "${searchTerm}". Try a different search term.`
                  : "There are no stores available at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  userRating={store.userRating}
                  onRateStore={handleRateStore}
                  onEditRating={handleEditRating}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredStores.length > storesPerPage && renderPagination()}
        </>
      )}

      {/* Rating Modal */}
      <RateStoreModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        store={selectedStore}
        existingRating={existingRating}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default UserStores;