const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
  },
  tokenAddress: {
    type: String,
    required: true,
  },
  blockchain: {
    type: String,
    required: true,
    enum: ['solana', 'ethereum', 'binance_smart_chain'],
  },
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell', 'swap', 'transfer', 'failed'],
  },
  amount: {
    type: Number,
    required: true,
  },
  amountUSD: {
    type: Number,
  },
  price: {
    type: Number,
  },
  txHash: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  walletAddress: {
    type: String,
    required: true,
  },
  isAutomated: {
    type: Boolean,
    default: false,
  },
  botConfig: {
    botType: String, // 'sniper', 'copy', 'auto'
    targetPrice: Number,
    slippage: Number,
    gasMultiplier: Number,
    antiMevEnabled: Boolean,
  },
  fees: {
    networkFee: Number, // in USD
    platformFee: Number, // in USD
  },
  notes: String,
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;