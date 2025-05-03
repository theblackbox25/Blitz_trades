const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user',
  },
  wallets: [{
    name: String,
    address: String,
    blockchain: String,
    isConnected: Boolean,
    default: Boolean,
  }],
  apiKeys: [{
    name: String,
    key: String,
    secret: String,
    platform: String,
    isActive: Boolean,
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
    notifications: {
      email: Boolean,
      telegram: Boolean,
      pushNotifications: Boolean,
    },
    defaultSlippage: Number,
    defaultGasMultiplier: Number,
  },
  telegramId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;