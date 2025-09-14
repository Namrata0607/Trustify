import React, { useState } from 'react';
import UserSidebar from '../components/user/UserSidebar';
import UserStores from '../components/user/UserStores';
import UserRatings from '../components/user/UserRatings';
import UserProfile from '../components/user/UserProfile';

function UserModule() {
  const [activeTab, setActiveTab] = useState('stores');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'stores':
        return <UserStores />;
      case 'ratings':
        return <UserRatings />;
      case 'profile':
        return <UserProfile />;
      default:
        return <UserStores />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="flex relative">
        <UserSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isMinimized={isSidebarMinimized}
          toggleSidebar={toggleSidebar}
        />
        
        <div className={`flex-1 transition-all duration-300 ease-in-out p-6 min-h-screen ${
          isSidebarMinimized ? 'ml-16' : 'ml-64'
        }`}>
          <div className="bg-white rounded-3xl shadow-2xl min-h-[calc(100vh-3rem)] p-8 border border-gray-100">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserModule;
