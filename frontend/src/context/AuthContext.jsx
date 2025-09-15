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
    const savedExpiration = localStorage.getItem('trustify_token_expiration');
    
    if (savedToken && savedUser && savedExpiration) {
      try {
        const expirationTime = parseInt(savedExpiration);
        const currentTime = Date.now();
        
        // Check if token is still valid
        if (currentTime < expirationTime) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } else {
          // Token expired, clear everything
          localStorage.removeItem('trustify_token');
          localStorage.removeItem('trustify_user');
          localStorage.removeItem('trustify_token_expiration');
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('trustify_token');
        localStorage.removeItem('trustify_user');
        localStorage.removeItem('trustify_token_expiration');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, rememberMe = false) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('trustify_token', authToken);
    localStorage.setItem('trustify_user', JSON.stringify(userData));
    
    // Set expiration based on remember me
    const expirationTime = rememberMe 
      ? Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      : Date.now() + (2 * 60 * 60 * 1000); // 2 hours (default)
    
    localStorage.setItem('trustify_token_expiration', expirationTime.toString());
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('trustify_token');
    localStorage.removeItem('trustify_user');
    localStorage.removeItem('trustify_token_expiration');
    // Note: We don't remove remembered email on manual logout
    // as users might want to keep their email remembered
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