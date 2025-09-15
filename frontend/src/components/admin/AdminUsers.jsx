import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { PlusIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ArrowsUpDownIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getUsers();
      // API returns array directly
      const usersList = Array.isArray(response) ? response : response.data || response.users || [];
      setUsers(usersList);
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleAddUser = async () => {
    try {
      setLoading(true);
      // Create user data for API (role is always normal user)
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        address: newUser.address
      };
      
      await adminAPI.addUser(userData);
      
      // Refresh users list
      await fetchUsers();
      
      // Reset form and close modal
      setNewUser({ name: '', email: '', password: '', address: '' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ ...user, password: '' });
    setShowAddModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      
      // Prepare user data for API (remove empty password)
      const userData = {
        name: newUser.name,
        email: newUser.email,
        address: newUser.address
      };
      
      // Only include password if it's provided
      if (newUser.password && newUser.password.trim()) {
        userData.password = newUser.password;
      }
      
      await adminAPI.updateUser(editingUser.id, userData);
      
      // Refresh users list after successful update
      await fetchUsers();
      
      // Reset form and close modal
      setEditingUser(null);
      setNewUser({ name: '', email: '', password: '', address: '' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await adminAPI.deleteUser(id);
        // Refresh the users list after successful deletion
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      USER: 'bg-green-100 text-green-800',
      STORE_OWNER: 'bg-blue-100 text-blue-800',
      ADMIN: 'bg-purple-100 text-purple-800'
    };

    const labels = {
      USER: 'Normal User',
      STORE_OWNER: 'Store Owner', 
      ADMIN: 'Admin'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  return (
    <div className="space-y-6">{loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading users...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage normal users and store owners</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or address..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="USER">Normal Users</option>
              <option value="STORE_OWNER">Store Owners</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg border border-green-300">
          <h3 className="text-green-700 font-medium text-sm">Total Users</h3>
          <p className="text-2xl font-bold text-green-900">{users.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg border border-blue-300">
          <h3 className="text-blue-700 font-medium text-sm">Store Owners</h3>
          <p className="text-2xl font-bold text-blue-900">
            {users.filter(u => u.role === 'STORE_OWNER').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-lg border border-purple-300">
          <h3 className="text-purple-700 font-medium text-sm">Normal Users</h3>
          <p className="text-2xl font-bold text-purple-900">
            {users.filter(u => u.role === 'USER').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'address', label: 'Address' },
                  { key: 'role', label: 'Role' },
                  { key: 'rating', label: 'Rating' },
                  { key: 'actions', label: 'Actions' }
                ].map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.key !== 'actions' ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center space-x-1 hover:text-gray-900"
                      >
                        <span>{column.label}</span>
                        <ArrowsUpDownIcon className="w-4 h-4" />
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">Joined: {user.createdAt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {getRoleBadge(user.role)}
                      {user.role === 'STORE_OWNER' && (
                        <span className="text-xs text-gray-500">{user.stores?.length || 0} stores</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'STORE_OWNER' && user.stores && user.stores.length > 0 ? (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {(user.stores.reduce((sum, store) => sum + (store.averageRating || 0), 0) / user.stores.length).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({user.stores.length} {user.stores.length === 1 ? 'store' : 'stores'})
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                   {user.role !== 'ADMIN' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Edit user"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Delete user"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {editingUser && '(leave empty to keep current)'}
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={editingUser ? "Enter new password (optional)" : "Enter password"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                  rows="3"
                />
              </div>
              {/* Role is now fixed as Normal User, not editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text" 
                  value="Normal User"
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">New users are created as Normal Users by default</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                  setNewUser({ name: '', email: '', password: '', address: '' });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : (editingUser ? 'Update' : 'Add')} User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;