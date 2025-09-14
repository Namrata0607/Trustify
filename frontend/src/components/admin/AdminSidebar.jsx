import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  HomeIcon, 
  BuildingStorefrontIcon, 
  UserGroupIcon, 
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ activeTab, setActiveTab, isMinimized, toggleSidebar }) => {
  const { user } = useContext(AuthContext) || {};
  // Use user data instead of adminData, with fallback for when user is not yet loaded
  const adminData = user || { name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' };
  
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />
    },
    {
      id: 'stores',
      name: 'Stores',
      icon: <BuildingStorefrontIcon className="w-5 h-5" />
    },
    {
      id: 'users',
      name: 'Users',
      icon: <UserGroupIcon className="w-5 h-5" />
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: <UserCircleIcon className="w-5 h-5" />
    }
  ];

  const handleLogout = () => {
    // Remove auth data from localStorage
    localStorage.removeItem('trustify_token');
    localStorage.removeItem('trustify_user');
    console.log('Logged out successfully');
    
    // Redirect to login page (you can use react-router's navigate function here)
    window.location.href = '/login';
  };

  const handleFeedback = () => {
    // Handle feedback logic
    console.log('Feedback clicked');
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800 shadow-2xl z-40 transition-all duration-300 ease-in-out ${
      isMinimized ? 'w-16' : 'w-64'
    }`}>
      {/* Header with hamburger menu */}
        <div className="p-2 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className={`flex items-center ${isMinimized ? 'justify-center w-full' : 'space-x-2'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          {!isMinimized && (
            <span className="hidden sm:inline text-lg font-bold text-gray-800">Trustify</span>
          )}
            </div>
            <button
          onClick={toggleSidebar}
          className="ml-2 p-1 hover:bg-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
            >
            {isMinimized ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            )}
            </button>
          </div>
          {!isMinimized && (
            <div className="mb-2 sm:mb-4">
          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-semibold rounded-full shadow-sm">
            Admin Panel
          </span>
            </div>
          )}
        </div>
        {/* Profile Section */}
      {!isMinimized && (
        <div className="px-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
              <span className="text-sm font-semibold">
                {adminData.name ? adminData.name.split(' ').map(n => n[0]).join('') : 'A'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-800">{adminData.name || 'Admin User'}</h3>
              <p className="text-gray-600 text-xs">{adminData.email || 'admin@example.com'}</p>
              <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                {adminData.role || 'ADMIN'}
              </span>
            </div>
          </div>
        </div>
      )}

      {isMinimized && (
        <div className="px-2 mb-6 flex justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
            <span className="text-sm font-semibold">
              {adminData.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
      )}

      {/* Menu Section */}
      <nav className={`flex-1 ${isMinimized ? 'px-2' : 'px-4'}`}>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${isMinimized ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg transition-all duration-200 text-sm group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
                }`}
                title={isMinimized ? item.name : ''}
              >
                {item.icon}
                {!isMinimized && <span className="font-medium">{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className={`p-4 space-y-1 ${isMinimized ? 'px-2' : ''}`}>
        <button
          onClick={handleFeedback}
          className={`w-full flex items-center ${isMinimized ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-gray-600 hover:bg-white/50 hover:text-gray-800 transition-all duration-200 text-sm`}
          title={isMinimized ? 'Feedback' : ''}
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          {!isMinimized && <span className="font-medium">Feedback</span>}
        </button>
        
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isMinimized ? 'justify-center px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 text-sm`}
          title={isMinimized ? 'Logout' : ''}
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          {!isMinimized && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;