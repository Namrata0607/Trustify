// API Configuration
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://trustify-r0jd.onrender.com';
const BASE_URL = 'http://localhost:3000';

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('trustify_token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
  const response = await fetch(url, defaultOptions);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
    }

    const data = await response.json();

    if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // Logout user (if needed)
  logout: async () => {
    return apiRequest('/api/auth/logout', {
      method: 'POST'
    });
  },

  // Verify token (if needed)
  verifyToken: async () => {
    return apiRequest('/api/auth/verify', {
      method: 'GET'
    });
  }
};

// Admin API functions
export const adminAPI = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    return apiRequest('/api/admin/dashboard', {
      method: 'GET'
    });
  },

  // Get all users
  getUsers: async () => {
    return apiRequest('/api/admin/users', {
      method: 'GET'
    });
  },

  // Get all stores
  getStores: async () => {
    return apiRequest('/api/admin/stores', {
      method: 'GET'
    });
  },

  // Add new store
  addStore: async (storeData) => {
    return apiRequest('/api/admin/add-stores', {
      method: 'POST',
      body: JSON.stringify(storeData)
    });
  },

  // Add new user
  addUser: async (userData) => {
    return apiRequest('/api/admin/add-users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  updatePassword: async (passwordData) => {
    return apiRequest('/api/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  },

  updateStore: async (storeId, storeData) => {
    return apiRequest(`/api/admin/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(storeData)
    });
  },
  deleteStore: async (storeId) => {
    return apiRequest(`/api/admin/stores/${storeId}`, {
      method: 'DELETE'
    });
  }
};

    

// Export base URL for other uses
export { BASE_URL };