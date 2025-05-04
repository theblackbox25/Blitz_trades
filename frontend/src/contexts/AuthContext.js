import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for auth headers
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Load user data if token exists
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token, fetchUserProfile]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setCurrentUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
      setLoading(false);
    }
  };

  // Register a new user
  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/users/register', {
        username,
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Errore durante la registrazione',
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/users/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Credenziali non valide',
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const result = await axios.put('/api/users/profile', userData);
      setCurrentUser(result.data.user);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Errore durante l\'aggiornamento del profilo',
      };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put('/api/users/change-password', {
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Errore durante la modifica della password',
      };
    }
  };

  // Add wallet to user
  const addWallet = async (name, address, blockchain) => {
    try {
      const response = await axios.post('/api/users/wallets', {
        name,
        address,
        blockchain,
      });
      setCurrentUser(prev => ({
        ...prev,
        wallets: response.data.wallets,
      }));
      return { success: true };
    } catch (error) {
      console.error('Add wallet error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Errore durante l\'aggiunta del wallet',
      };
    }
  };

  // Remove wallet from user
  const removeWallet = async (walletId) => {
    try {
      const response = await axios.delete(`/api/users/wallets/${walletId}`);
      setCurrentUser(prev => ({
        ...prev,
        wallets: response.data.wallets,
      }));
      return { success: true };
    } catch (error) {
      console.error('Remove wallet error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Errore durante la rimozione del wallet',
      };
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    addWallet,
    removeWallet,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};