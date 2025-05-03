const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');

// Import route handlers
const userRoutes = require('./api/routes/user.routes');
const tradingRoutes = require('./api/routes/trading.routes');
const walletRoutes = require('./api/routes/wallet.routes');
const tokenRoutes = require('./api/routes/token.routes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(config.database.url)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/tokens', tokenRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: '0.1.0' });
});

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  // Don't exit the process in production, just log the error
  if (config.server.env === 'development') {
    process.exit(1);
  }
});

module.exports = app;