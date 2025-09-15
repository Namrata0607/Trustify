import React, { useState } from 'react';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerDashboard from '../components/owner/OwnerDashboard';
import OwnerRatings from '../components/owner/OwnerRatings';
import OwnerProfile from '../components/owner/OwnerProfile';

export default function OwnerModule() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OwnerDashboard />;
      case 'ratings':
        return <OwnerRatings />;
      case 'profile':
        return <OwnerProfile />;
      default:
        return <OwnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="flex relative">
        <OwnerSidebar 
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
