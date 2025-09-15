import React, { useState, useEffect, useCallback } from 'react';
import StoreCard from './StoreCard';
import RateStoreModal from './RateStoreModal';
import { MagnifyingGlassIcon, ChevronUpDownIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
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
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const storesPerPage = 10; // Changed to 10 for table view

  // Fetch stores from API
  const fetchStores = useCallback(async () => {
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
  }, [currentPage, storesPerPage, searchTerm]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

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

  // Sort stores
  const getSortedStores = (storesToSort) => {
    return [...storesToSort].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'address':
          aValue = a.address.toLowerCase();
          bValue = b.address.toLowerCase();
          break;
        case 'overallRating':
          aValue = a.overallRating || 0;
          bValue = b.overallRating || 0;
          break;
        case 'userRating':
          aValue = a.userRating || 0;
          bValue = b.userRating || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const filteredStores = getFilteredStores();
  const sortedStores = getSortedStores(filteredStores);

  // Paginate stores
  const paginatedStores = sortedStores.slice(
    (currentPage - 1) * storesPerPage,
    currentPage * storesPerPage
  );

  // Generate pagination controls
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedStores.length / storesPerPage); i++) {
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
          {/* Store Table */}
          {paginatedStores.length === 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-12 text-center text-gray-500">
                <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-1">No stores found</p>
                <p className="text-sm text-gray-500">
                  {searchTerm
                    ? `No stores matching "${searchTerm}". Try a different search term.`
                    : "There are no stores available at the moment."}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => {
                        if (sortBy === 'name') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('name');
                          setSortOrder('asc');
                        }
                      }}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Store Name</span>
                        <ChevronUpDownIcon className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      onClick={() => {
                        if (sortBy === 'address') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('address');
                          setSortOrder('asc');
                        }
                      }}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Address</span>
                        <ChevronUpDownIcon className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      onClick={() => {
                        if (sortBy === 'overallRating') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('overallRating');
                          setSortOrder('asc');
                        }
                      }}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Overall Rating</span>
                        <ChevronUpDownIcon className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      onClick={() => {
                        if (sortBy === 'userRating') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('userRating');
                          setSortOrder('asc');
                        }
                      }}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Your Rating</span>
                        <ChevronUpDownIcon className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      userRating={store.userRating}
                      onRateStore={handleRateStore}
                      onEditRating={handleEditRating}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {sortedStores.length > storesPerPage && renderPagination()}
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