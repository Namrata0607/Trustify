import React, { useState, useEffect } from 'react';
import AutocompleteInput from '../AutocompleteInput';
import { adminAPI } from '../../utils/api';

const AddStoreModal = ({ isOpen, onClose, onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    assignedTo: null
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await adminAPI.getUsers();

      // Since API returns an array directly, just set it
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      // For development/testing, add some mock users
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'store_owner' }
      ];
      setUsers(mockUsers);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: user
    }));
    setShowNewUserForm(false);
  };

  const handleNewUserRequest = (searchTerm) => {
    // Generate a suggested email from the search term
    const suggestedEmail = searchTerm.toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '') + '@gmail.com';
    
    setNewUserData(prev => ({
      ...prev,
      name: searchTerm,
      email: suggestedEmail
    }));
    setShowNewUserForm(true);
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      await adminAPI.addUser(newUserData);
      
      // Refresh the entire users list to ensure consistency
      await fetchUsers();
      
      // Select the new user (find by email since it's unique)
      const updatedUsers = await adminAPI.getUsers();
      const usersList = updatedUsers.users || updatedUsers.data || updatedUsers || [];
      const createdUser = usersList.find(user => user.email === newUserData.email);
      
      if (createdUser) {
        setFormData(prev => ({
          ...prev,
          assignedTo: createdUser
        }));
      }
      
      setShowNewUserForm(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        address: ''
      });
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.assignedTo) {
      alert('Please select or create a user to assign the store to.');
      return;
    }

    setIsLoading(true);
    try {
      const storeData = {
        storeName: formData.name,
        storeEmail: formData.email,
        storeAddress: formData.address,
        userId: formData.assignedTo.id
      };
      console.log('Submitting store data:', storeData.userId);
      await adminAPI.addStore(storeData);
      onStoreAdded();
      handleClose();
    } catch (error) {
      console.error('Error creating store:', error);
      alert('Failed to create store. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      address: '',
      assignedTo: null
    });
    setShowNewUserForm(false);
    setNewUserData({
      name: '',
      email: '',
      password: '',
      address: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Add New Store</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Store Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter store name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter store email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter store address"
              />
            </div>
          </div>

          {/* User Assignment */}
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Loading users...</span>
            </div>
          ) : (
            <AutocompleteInput
              users={users}
              selectedUser={formData.assignedTo}
              onUserSelect={handleUserSelect}
              onNewUserRequest={handleNewUserRequest}
              placeholder="Search for a user..."
              label="Store Owner"
            />
          )}

          {/* New User Form */}
          {showNewUserForm && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Create New Store Owner</h3>
              <p className="text-xs text-gray-600 mb-3">This user will be able to manage and own stores</p>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={newUserData.name}
                    onChange={handleNewUserInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewUserInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    value={newUserData.password}
                    onChange={handleNewUserInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="address"
                    value={newUserData.address}
                    onChange={handleNewUserInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Address"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleCreateUser}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewUserForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? 'Creating...' : 'Add Store'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStoreModal;