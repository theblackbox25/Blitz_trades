import axios from 'axios';

// Base API configuration
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Token service
export const tokenService = {
  // Get trending tokens
  getTrending: async (blockchain, limit = 10, offset = 0) => {
    try {
      const response = await axios.get(`${API_URL}/tokens/trending`, {
        params: { blockchain, limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      throw error;
    }
  },
  
  // Search tokens
  searchTokens: async (query, blockchain, limit = 10, offset = 0) => {
    try {
      const response = await axios.get(`${API_URL}/tokens/search`, {
        params: { q: query, blockchain, limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching tokens:', error);
      throw error;
    }
  },
  
  // Get token details
  getTokenDetails: async (contractAddress, blockchain) => {
    try {
      const response = await axios.get(`${API_URL}/tokens/${contractAddress}`, {
        params: { blockchain },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching token details:', error);
      throw error;
    }
  },
  
  // Analyze token security
  analyzeTokenSecurity: async (contractAddress, blockchain) => {
    try {
      const response = await axios.get(`${API_URL}/tokens/${contractAddress}/security`, {
        params: { blockchain },
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing token security:', error);
      throw error;
    }
  },
};

// Wallet service
export const walletService = {
  // Get wallet transactions
  getWalletTransactions: async (address, blockchain, limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/wallets/${address}/transactions`, {
        params: { blockchain, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      throw error;
    }
  },
  
  // Track wallet
  trackWallet: async (address, blockchain, label, isWhale, isInfluencer) => {
    try {
      const response = await axios.post(`${API_URL}/wallets/track`, {
        address,
        blockchain,
        label,
        isWhale,
        isInfluencer,
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking wallet:', error);
      throw error;
    }
  },
  
  // Get wallet stats
  getWalletStats: async (address, blockchain) => {
    try {
      const response = await axios.get(`${API_URL}/wallets/${address}/stats`, {
        params: { blockchain },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet stats:', error);
      throw error;
    }
  },
  
  // Get smart money wallets
  getSmartMoneyWallets: async (blockchain, category, limit = 10, offset = 0) => {
    try {
      const response = await axios.get(`${API_URL}/wallets/smart-money`, {
        params: { blockchain, category, limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching smart money wallets:', error);
      throw error;
    }
  },
};

// Trading service
export const tradingService = {
  // Get user's trading bots
  getUserBots: async () => {
    try {
      const response = await axios.get(`${API_URL}/trading/bots`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bots:', error);
      throw error;
    }
  },
  
  // Get bot details
  getBotDetails: async (botId) => {
    try {
      const response = await axios.get(`${API_URL}/trading/bots/${botId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bot details:', error);
      throw error;
    }
  },
  
  // Create trading bot
  createBot: async (botData) => {
    try {
      const response = await axios.post(`${API_URL}/trading/bots`, botData);
      return response.data;
    } catch (error) {
      console.error('Error creating bot:', error);
      throw error;
    }
  },
  
  // Stop bot
  stopBot: async (botId) => {
    try {
      const response = await axios.post(`${API_URL}/trading/bots/${botId}/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping bot:', error);
      throw error;
    }
  },
  
  // Start bot
  startBot: async (botId) => {
    try {
      const response = await axios.post(`${API_URL}/trading/bots/${botId}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting bot:', error);
      throw error;
    }
  },
  
  // Get user transactions
  getUserTransactions: async (limit = 10, offset = 0, status, type, blockchain) => {
    try {
      const response = await axios.get(`${API_URL}/trading/transactions`, {
        params: { limit, offset, status, type, blockchain },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  },
  
  // Execute manual transaction
  executeTransaction: async (transactionData) => {
    try {
      const response = await axios.post(`${API_URL}/trading/execute`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  },
};