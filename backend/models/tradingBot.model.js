const mongoose = require('mongoose');

const tradingBotSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['sniper', 'copyTrading', 'autoTrading', 'limitOrder'],
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'stopped', 'completed', 'failed'],
    default: 'active',
  },
  blockchain: {
    type: String,
    required: true,
    enum: ['solana', 'ethereum', 'binance_smart_chain'],
  },
  walletAddress: {
    type: String,
    required: true,
  },
  config: {
    // Sniper bot configuration
    sniperConfig: {
      tokenAddress: String,
      maxPrice: Number,
      amount: Number, // in blockchain native token (SOL, ETH, etc.)
      amountUSD: Number,
      startTime: Date,
      endTime: Date,
      buyConditions: {
        minLiquidity: Number,
        maxSlippage: Number,
        instantBuy: Boolean,
      },
    },
    // Copy trading configuration
    copyTradingConfig: {
      targetWallets: [String], // Addresses to copy
      maxTransactionUSD: Number,
      onlyBuy: Boolean,
      onlySell: Boolean,
      delaySeconds: Number,
      minHoldTimeMinutes: Number,
      filterTokens: [String], // Exclude certain tokens
    },
    // Auto trading configuration
    autoTradingConfig: {
      strategy: {
        type: String,
        enum: ['momentum', 'trend_following', 'breakout', 'custom'],
      },
      customStrategyId: mongoose.Schema.Types.ObjectId,
      takeProfitPercentage: Number,
      stopLossPercentage: Number,
      maxPositions: Number,
      maxPositionSizeUSD: Number,
      timeframe: String, // '1m', '5m', '15m', '1h', '4h', '1d'
    },
    // Limit order configuration
    limitOrderConfig: {
      tokenAddress: String,
      limitPrice: Number,
      amount: Number,
      direction: {
        type: String,
        enum: ['buy', 'sell'],
      },
      expiryTime: Date,
      partial: Boolean, // Allow partial fills
    },
    // General configuration
    generalConfig: {
      slippage: Number, // Default slippage percentage
      gasMultiplier: Number, // Gas price multiplier
      antiMevEnabled: Boolean,
      maxTransactionsPerDay: Number,
      useTelegram: Boolean,
      useProtectionMechanisms: Boolean,
    },
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
  performance: {
    totalProfitUSD: Number,
    totalTransactions: Number,
    successRate: Number, // Percentage of successful transactions
    averageHoldTime: Number, // In minutes
    roi: Number, // Return on investment percentage
  },
  logs: [{
    timestamp: Date,
    message: String,
    level: {
      type: String,
      enum: ['info', 'warning', 'error'],
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const TradingBot = mongoose.model('TradingBot', tradingBotSchema);

module.exports = TradingBot;