
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import AddStoreModal from './AddStoreModal';
import EditStoreModal from './EditStoreModal';
import { PlusIcon, MagnifyingGlassIcon, ChevronUpDownIcon, BuildingStorefrontIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // Fetch stores from API
  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminAPI.getStores();
      setStores(data);
    } catch (err) {
      setError('Failed to fetch stores: ' + err.message);
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

    // Handle store delete
  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    try {
      await adminAPI.deleteStore(storeId);
      fetchStores();
    } catch (err) {
      alert('Failed to delete store: ' + (err.message || err));
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Handle store added
  const handleStoreAdded = () => {
    fetchStores(); // Refresh the stores list
  };

  // Handle store updated
  const handleStoreUpdated = () => {
    fetchStores();
  };

  // Filter and sort stores
  const filteredAndSortedStores = stores
    .filter(store => {
      const searchLower = searchTerm.toLowerCase();
      return (
        store.name.toLowerCase().includes(searchLower) ||
        store.email.toLowerCase().includes(searchLower) ||
        store.address.toLowerCase().includes(searchLower) ||
        store.owner.name.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.averageRating || 0;
          bValue = b.averageRating || 0;
          break;
        case 'owner':
          aValue = a.owner.name.toLowerCase();
          bValue = b.owner.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'address':
          aValue = a.address.toLowerCase();
          bValue = b.address.toLowerCase();
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
  const averageRating = stores.length > 0 
    ? (stores.reduce((sum, store) => sum + (store.averageRating || 0), 0) / stores.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading stores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all registered stores</p>
        </div>
        <button 
          onClick={() => setIsAddStoreModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Store
        </button>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Stores</label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Stores</option>
            <option>Verified Stores</option>
            <option>Pending Stores</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-green-800 text-lg font-semibold">Total Stores</h3>
          <p className="text-green-900 text-3xl font-bold">{stores.length}</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-blue-800 text-lg font-semibold">Average Rating</h3>
          <p className="text-blue-900 text-3xl font-bold">{averageRating}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg">
          <h3 className="text-purple-800 text-lg font-semibold">Active Stores</h3>
          <p className="text-purple-900 text-3xl font-bold">{stores.length}</p>
        </div>
      </div>

      {/* Stores Table */}
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
                  <span>Name</span>
                  <ChevronUpDownIcon className="w-4 h-4" />
                </div>
              </th>
              <th 
                onClick={() => {
                  if (sortBy === 'email') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('email');
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
                  if (sortBy === 'owner') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('owner');
                    setSortOrder('asc');
                  }
                }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Owner</span>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedStores.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-1">No stores found</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new store.'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredAndSortedStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  {/* Name Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {store.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{store.name}</div>
                        <div className="text-sm text-gray-500">Store ID: {store.id}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Email Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{store.email}</div>
                  </td>
                  
                  {/* Address Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{store.address}</div>
                  </td>
                  
                  {/* Owner Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                        {store.owner.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{store.owner.name}</div>
                        <div className="text-sm text-gray-500">{store.owner.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Rating Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-2">
                        {renderStars(store.averageRating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {store.averageRating ? store.averageRating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        onClick={() => {
                          setSelectedStore(store);
                          setIsEditStoreModalOpen(true);
                        }}
                        title="Edit store"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        onClick={() => handleDeleteStore(store.id)}
                        title="Delete store"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td> 
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Store Modal */}
      <AddStoreModal
        isOpen={isAddStoreModalOpen}
        onClose={() => setIsAddStoreModalOpen(false)}
        onStoreAdded={handleStoreAdded}
      />

      {/* Edit Store Modal */}
      <EditStoreModal
        isOpen={isEditStoreModalOpen}
        onClose={() => setIsEditStoreModalOpen(false)}
        store={selectedStore}
        onStoreUpdated={handleStoreUpdated}
      />
    </div>
  );
};

export default AdminStores;