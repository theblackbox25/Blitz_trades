import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userService } from '../services/api';

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

  // Logout user - definita per prima in modo da poterla usare in fetchUserProfile
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
  };
  
  // Fetch user profile - definita prima dell'useEffect che la utilizza
  const fetchUserProfile = async () => {
    try {
      // Usa il servizio API mockato
      const response = await userService.getProfile();
      setCurrentUser(response.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
      setLoading(false);
    }
  };

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
  }, [token]); // Non è necessario includere fetchUserProfile nelle dipendenze

  // Register a new user
  const register = async (username, email, password) => {
    try {
      // Usa il servizio API mockato
      const result = await userService.register(username, email, password);
      const { token, user } = result;
      localStorage.setItem('authToken', token);
      setToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Errore durante la registrazione',
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      // Usa il servizio API mockato
      const result = await userService.login(email, password);
      const { token, user } = result;
      localStorage.setItem('authToken', token);
      setToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Credenziali non valide',
      };
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      // Usa il servizio API mockato
      const result = await userService.updateProfile(userData);
      setCurrentUser(result.user);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: error.message || 'Errore durante l\'aggiornamento del profilo',
      };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      // Usa il servizio API mockato
      const result = await userService.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        message: error.message || 'Errore durante la modifica della password',
      };
    }
  };

  // Add wallet to user
  const addWallet = async (name, address, blockchain) => {
    try {
      // Usa il servizio API mockato
      const result = await userService.addWallet(name, address, blockchain);
      setCurrentUser(prev => ({
        ...prev,
        wallets: result.wallets,
      }));
      return { success: true };
    } catch (error) {
      console.error('Add wallet error:', error);
      return {
        success: false,
        message: error.message || 'Errore durante l\'aggiunta del wallet',
      };
    }
  };

  // Remove wallet from user
  const removeWallet = async (walletId) => {
    try {
      // Usa il servizio API mockato
      const result = await userService.removeWallet(walletId);
      setCurrentUser(prev => ({
        ...prev,
        wallets: result.wallets,
      }));
      return { success: true };
    } catch (error) {
      console.error('Remove wallet error:', error);
      return {
        success: false,
        message: error.message || 'Errore durante la rimozione del wallet',
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