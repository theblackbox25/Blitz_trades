const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
  },
  contractAddress: {
    type: String,
    required: true,
    unique: true,
  },
  blockchain: {
    type: String,
    required: true,
    enum: ['solana', 'ethereum', 'binance_smart_chain'],
  },
  decimals: {
    type: Number,
    required: true,
  },
  totalSupply: {
    type: String,
    required: true,
  },
  marketData: {
    price: Number,
    marketCap: Number,
    volume24h: Number,
    priceChange24h: Number,
    liquidityUSD: Number,
    holders: Number,
    lastUpdated: Date,
  },
  launchData: {
    launchDate: Date,
    initialPrice: Number,
    initialLiquidityUSD: Number,
    initialMarketCap: Number,
  },
  securityAnalysis: {
    isHoneypot: Boolean,
    rugPullRisk: {
      type: String,
      enum: ['low', 'medium', 'high', 'very_high'],
    },
    contractVerified: Boolean,
    hasLiquidityLock: Boolean,
    lockEndTime: Date,
    ownershipRenounced: Boolean,
    warningFlags: [String],
    securityScore: Number, // 0-100
  },
  socialData: {
    website: String,
    telegram: String,
    twitter: String,
    discord: String,
    github: String,
  },
  isTracked: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  description: String,
  logoUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for searches
tokenSchema.index({ name: 'text', symbol: 'text', contractAddress: 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;