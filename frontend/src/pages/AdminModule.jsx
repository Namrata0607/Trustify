import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminStores from '../components/admin/AdminStores';
import AdminUsers from '../components/admin/AdminUsers';
import AdminProfile from '../components/admin/AdminProfile';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdminModule Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">Something went wrong</div>
            <div className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminModule() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const renderMainContent = () => {
    const componentToRender = (() => {
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
    })();

    return (
      <ErrorBoundary>
        {componentToRender}
      </ErrorBoundary>
    );
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
