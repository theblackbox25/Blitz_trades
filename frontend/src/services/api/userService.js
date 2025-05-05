// API service for user-related operations
import axios from 'axios';

// Base URL for API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mock data for development (remove in production)
const mockUsers = {
  'user1@example.com': {
    id: 'user1',
    username: 'trader1',
    email: 'user1@example.com',
    fullName: 'Mario Rossi',
    telegramUsername: '@mariorossi',
    wallets: [
      { 
        id: 'wallet1', 
        name: 'Portafoglio ETH', 
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 
        blockchain: 'ethereum',
        balance: 1.45
      },
      { 
        id: 'wallet2', 
        name: 'Portafoglio SOL', 
        address: 'AaB5yGqLxRngWQD4hPyVYCYXxr4uK4e6YfZ5tW2XGbJm', 
        blockchain: 'solana',
        balance: 24.8
      }
    ],
    created_at: '2025-01-15T12:00:00Z',
  },
};

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Helper function to simulate API delay
const mockApiDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// User profile service functions
export const userService = {
  // Login user
  login: async (email, password) => {
    if (isDevelopment) {
      await mockApiDelay();
      const user = mockUsers[email];
      
      if (!user || password !== 'password') { // Simple password check for mock
        throw new Error('Credenziali non valide');
      }
      
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', token);
      
      return { token, user };
    }
    
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    return response.data;
  },
  
  // Register new user
  register: async (username, email, password) => {
    if (isDevelopment) {
      await mockApiDelay();
      
      if (mockUsers[email]) {
        throw new Error('Email già in uso');
      }
      
      const newUser = {
        id: `user${Date.now()}`,
        username,
        email,
        wallets: [],
        created_at: new Date().toISOString(),
      };
      
      mockUsers[email] = newUser;
      const token = 'mock-jwt-token-' + Date.now();
      
      return { token, user: newUser };
    }
    
    const response = await axios.post(`${API_URL}/users/register`, { username, email, password });
    return response.data;
  },
  
  // Get user profile
  getProfile: async () => {
    if (isDevelopment) {
      await mockApiDelay();
      // In a real app, we would use the token to identify the user
      // For mock, just return the first user
      const mockUser = Object.values(mockUsers)[0];
      
      if (!mockUser) {
        throw new Error('Utente non trovato');
      }
      
      return { user: mockUser };
    }
    
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    if (isDevelopment) {
      await mockApiDelay();
      // In a real app, we would use the token to identify the user
      // For mock, just update the first user
      const mockUser = Object.values(mockUsers)[0];
      
      if (!mockUser) {
        throw new Error('Utente non trovato');
      }
      
      // Update user data
      Object.assign(mockUser, userData);
      
      return { user: mockUser };
    }
    
    const response = await axios.put(`${API_URL}/users/profile`, userData);
    return response.data;
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    if (isDevelopment) {
      await mockApiDelay();
      
      // Simple validation for mock
      if (currentPassword !== 'password') {
        throw new Error('Password attuale non corretta');
      }
      
      return { success: true };
    }
    
    const response = await axios.put(`${API_URL}/users/change-password`, { currentPassword, newPassword });
    return response.data;
  },
  
  // Add wallet
  addWallet: async (name, address, blockchain) => {
    if (isDevelopment) {
      await mockApiDelay();
      
      const mockUser = Object.values(mockUsers)[0];
      
      if (!mockUser) {
        throw new Error('Utente non trovato');
      }
      
      // Create new wallet
      const newWallet = {
        id: `wallet${Date.now()}`,
        name,
        address,
        blockchain,
        balance: Math.random() * 10, // Random balance for mock
      };
      
      // Add to user's wallets
      mockUser.wallets = [...(mockUser.wallets || []), newWallet];
      
      return { wallets: mockUser.wallets };
    }
    
    const response = await axios.post(`${API_URL}/users/wallets`, { name, address, blockchain });
    return response.data;
  },
  
  // Remove wallet
  removeWallet: async (walletId) => {
    if (isDevelopment) {
      await mockApiDelay();
      
      const mockUser = Object.values(mockUsers)[0];
      
      if (!mockUser) {
        throw new Error('Utente non trovato');
      }
      
      // Filter out the wallet to remove
      mockUser.wallets = (mockUser.wallets || []).filter(wallet => wallet.id !== walletId);
      
      return { wallets: mockUser.wallets };
    }
    
    const response = await axios.delete(`${API_URL}/users/wallets/${walletId}`);
    return response.data;
  },
};

export default userService;