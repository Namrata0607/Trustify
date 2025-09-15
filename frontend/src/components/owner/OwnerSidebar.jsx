import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  HomeIcon, 
  StarIcon, 
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const OwnerSidebar = ({ activeTab, setActiveTab, isMinimized, toggleSidebar }) => {
  const { user } = useContext(AuthContext) || {};
  // Use user data with fallback for when user is not yet loaded
  const ownerData = user || { name: 'Store Owner', email: 'owner@example.com', role: 'STORE_OWNER' };
  
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <HomeIcon className="w-6 h-6" />
    },
    {
      id: 'ratings',
      name: 'Store Ratings',
      icon: <StarIcon className="w-6 h-6" />
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: <UserCircleIcon className="w-6 h-6" />
    }
  ];

  const handleLogout = () => {
    // Remove auth data from localStorage
    localStorage.removeItem('trustify_token');
    localStorage.removeItem('trustify_user');
    console.log('Logged out successfully');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const handleFeedback = () => {
    // Handle feedback logic
    console.log('Feedback clicked');
  };

  return (
    <div
      className={`bg-white h-screen shadow-xl border-r border-gray-100 transition-all duration-300 ease-in-out fixed z-10 ${
        isMinimized ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
      >
        {isMinimized ? (
          <ChevronRightIcon className="w-5 h-5" />
        ) : (
          <ChevronLeftIcon className="w-5 h-5" />
        )}
      </button>

      <div className="h-full flex flex-col justify-between">
        <div>
          {/* Owner Profile Section */}
          <div className={`p-4 mb-6 border-b border-gray-100 ${isMinimized ? 'text-center' : ''}`}>
            <div className={`flex ${isMinimized ? 'justify-center' : 'items-center space-x-3'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {ownerData.name ? ownerData.name.split(' ').map(n => n[0]).join('') : 'O'}
              </div>
              {!isMinimized && (
                <div className="overflow-hidden">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {ownerData.name || 'Store Owner'}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{ownerData.email || 'owner@example.com'}</p>
                  <span className="inline-block bg-gradient-to-br from-blue-500 to-purple-400 text-white text-xs px-2 py-1 rounded-full mt-1">
                    STORE OWNER
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${isMinimized ? 'justify-center' : 'justify-start space-x-3'}`}
              >
                <div>{item.icon}</div>
                {!isMinimized && <span>{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-gray-100">
          <button
            onClick={handleFeedback}
            className={`w-full flex items-center p-3 mb-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 ${
              isMinimized ? 'justify-center' : 'justify-start space-x-3'
            }`}
            title={isMinimized ? 'Feedback' : ''}
          >
            <div><ChatBubbleLeftRightIcon className="w-4 h-4" /></div>
            {!isMinimized && <span className="font-medium">Feedback</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 ${
              isMinimized ? 'justify-center' : 'justify-start space-x-3'
            }`}
            title={isMinimized ? 'Logout' : ''}
          >
            <div><ArrowRightOnRectangleIcon className="w-4 h-4" /></div>
            {!isMinimized && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerSidebar;