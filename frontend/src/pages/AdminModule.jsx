import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminStores from '../components/admin/AdminStores';
import AdminUsers from '../components/admin/AdminUsers';
import AdminProfile from '../components/admin/AdminProfile';

export default function AdminModule() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'stores':
        return <AdminStores />;
      case 'users':
        return <AdminUsers />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="flex relative">
        <AdminSidebar 
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
