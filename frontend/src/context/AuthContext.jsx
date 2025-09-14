/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Export the context directly so components can import it
export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('trustify_token');
    const savedUser = localStorage.getItem('trustify_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('trustify_token');
        localStorage.removeItem('trustify_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('trustify_token', authToken);
    localStorage.setItem('trustify_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('trustify_token');
    localStorage.removeItem('trustify_user');
  };

  const isAuthenticated = () => {
    return !!(token && user);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN' || user?.role === 'SYSTEM_ADMINISTRATOR';
  };

  const isStoreOwner = () => {
    return user?.role === 'STORE_OWNER';
  };

  const isUser = () => {
    return user?.role === 'USER' || user?.role === 'NORMAL_USER';
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isStoreOwner,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};