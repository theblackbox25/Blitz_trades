require('dotenv').config();

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
  },
  
  // Database configuration
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/blitz-trades',
  },
  
  // JWT configuration for authentication
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // Blockchain API configuration
  blockchain: {
    solana: {
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    },
    ethereum: {
      rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your-infura-key',
    },
  },
  
  // Exchange API configuration
  exchanges: {
    // Add exchange API keys and configurations
  },
  
  // Telegram bot configuration
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    notificationChannelId: process.env.TELEGRAM_NOTIFICATION_CHANNEL_ID,
  },
  
  // Trading bot configuration
  tradingBot: {
    defaultSlippage: 0.5, // 0.5%
    defaultGasMultiplier: 1.5,
    antiMevEnabled: true,
  },
};