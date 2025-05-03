const express = require('express');
const jwt = require('jsonwebtoken');
const walletTracker = require('../../services/walletTracker.service');
const config = require('../../config/config');

const router = express.Router();

// Middleware per verificare il token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token di autenticazione mancante' });
  }
  
  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token non valido o scaduto' });
    }
    
    req.user = user;
    next();
  });
};

// Ottieni transazioni di un wallet
router.get('/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    const { blockchain, limit = 10 } = req.query;
    
    if (!blockchain) {
      return res.status(400).json({ message: 'Parametro blockchain obbligatorio' });
    }
    
    const transactions = await walletTracker.getWalletTransactions(
      address,
      blockchain,
      parseInt(limit)
    );
    
    res.status(200).json({
      transactions,
    });
  } catch (error) {
    console.error('Errore durante il recupero delle transazioni del wallet:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle transazioni del wallet', error: error.message });
  }
});

// Aggiungi wallet ai monitorati (richiede autenticazione)
router.post('/track', authenticateToken, async (req, res) => {
  try {
    const { address, blockchain, label, isWhale, isInfluencer } = req.body;
    
    if (!address || !blockchain) {
      return res.status(400).json({ message: 'Indirizzo e blockchain obbligatori' });
    }
    
    const result = await walletTracker.addWalletToTrack(
      address,
      blockchain,
      label || '',
      isWhale || false,
      isInfluencer || false
    );
    
    res.status(201).json({
      message: 'Wallet aggiunto al monitoraggio',
      result,
    });
  } catch (error) {
    console.error('Errore durante l\'aggiunta del wallet al monitoraggio:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiunta del wallet al monitoraggio', error: error.message });
  }
});

// Ottieni statistiche di un wallet
router.get('/:address/stats', async (req, res) => {
  try {
    const { address } = req.params;
    const { blockchain } = req.query;
    
    if (!blockchain) {
      return res.status(400).json({ message: 'Parametro blockchain obbligatorio' });
    }
    
    const stats = await walletTracker.getWalletStats(address, blockchain);
    
    res.status(200).json({
      stats,
    });
  } catch (error) {
    console.error('Errore durante il recupero delle statistiche del wallet:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle statistiche del wallet', error: error.message });
  }
});

// Ottieni wallet di "smart money" (migliori trader)
router.get('/smart-money', async (req, res) => {
  try {
    const { blockchain, category, limit = 10, offset = 0 } = req.query;
    
    // Categorie: 'whales', 'influencers', 'early_buyers', 'successful_traders'
    // In un'implementazione reale, recuperare i wallet dal database
    const wallets = [
      {
        address: '0x123456789abcdef',
        blockchain: 'ethereum',
        label: 'Smart Trader 1',
        performance: {
          successRate: 85, // percentuale
          avgROI: 250, // percentuale
          totalTrades: 45,
        },
        categories: ['successful_traders', 'early_buyers'],
      },
      {
        address: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq',
        blockchain: 'solana',
        label: 'Whale 1',
        performance: {
          successRate: 92,
          avgROI: 180,
          totalTrades: 78,
        },
        categories: ['whales', 'successful_traders'],
      },
    ];
    
    // Filtra per blockchain e categoria
    let filteredWallets = wallets;
    if (blockchain) {
      filteredWallets = filteredWallets.filter(w => w.blockchain === blockchain);
    }
    if (category) {
      filteredWallets = filteredWallets.filter(w => w.categories.includes(category));
    }
    
    // Paginazione
    const paginatedWallets = filteredWallets.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.status(200).json({
      wallets: paginatedWallets,
      pagination: {
        total: filteredWallets.length,
        offset: parseInt(offset),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Errore durante il recupero dei wallet smart money:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei wallet smart money', error: error.message });
  }
});

module.exports = router;