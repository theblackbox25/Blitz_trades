const express = require('express');
const Token = require('../../models/token.model');
const securityAnalyzer = require('../../services/securityAnalyzer.service');

const router = express.Router();

// Middleware per verificare il token JWT (importato da user.routes.js)
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

// Ottieni lista token di tendenza
router.get('/trending', async (req, res) => {
  try {
    const { blockchain, limit = 10, offset = 0 } = req.query;
    
    let query = { isTrending: true };
    if (blockchain) {
      query.blockchain = blockchain;
    }
    
    const tokens = await Token.find(query)
      .sort({ 'marketData.volume24h': -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    
    const total = await Token.countDocuments(query);
    
    res.status(200).json({
      tokens,
      pagination: {
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Errore durante il recupero dei token di tendenza:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei token di tendenza', error: error.message });
  }
});

// Cerca token
router.get('/search', async (req, res) => {
  try {
    const { q, blockchain, limit = 10, offset = 0 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Parametro di ricerca obbligatorio' });
    }
    
    let query = {};
    
    // Cerca per nome, simbolo o indirizzo
    if (q) {
      if (q.length >= 40) {
        // Probabile indirizzo del contratto
        query.contractAddress = new RegExp(q, 'i');
      } else {
        query.$or = [
          { name: new RegExp(q, 'i') },
          { symbol: new RegExp(q, 'i') },
        ];
      }
    }
    
    // Filtra per blockchain
    if (blockchain) {
      query.blockchain = blockchain;
    }
    
    const tokens = await Token.find(query)
      .sort({ 'marketData.marketCap': -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    
    const total = await Token.countDocuments(query);
    
    res.status(200).json({
      tokens,
      pagination: {
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Errore durante la ricerca dei token:', error);
    res.status(500).json({ message: 'Errore durante la ricerca dei token', error: error.message });
  }
});

// Ottieni dettagli di un token
router.get('/:contractAddress', async (req, res) => {
  try {
    const { contractAddress } = req.params;
    const { blockchain } = req.query;
    
    let query = { contractAddress };
    if (blockchain) {
      query.blockchain = blockchain;
    }
    
    const token = await Token.findOne(query);
    
    if (!token) {
      // Se il token non u00e8 nel database, prova ad analizzarlo dinamicamente
      if (!blockchain) {
        return res.status(400).json({ message: 'Parametro blockchain obbligatorio per token non in database' });
      }
      
      const analysis = await securityAnalyzer.analyzeContract(contractAddress, blockchain);
      
      if (!analysis.success) {
        return res.status(404).json({ message: 'Token non trovato o non valido' });
      }
      
      // Per ora ritorniamo solo l'analisi, senza salvare nel database
      return res.status(200).json({
        token: null,
        analysis,
        message: 'Token non presente nel database, analisi dinamica eseguita',
      });
    }
    
    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error('Errore durante il recupero dei dettagli del token:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei dettagli del token', error: error.message });
  }
});

// Analizza la sicurezza di un token
router.get('/:contractAddress/security', async (req, res) => {
  try {
    const { contractAddress } = req.params;
    const { blockchain } = req.query;
    
    if (!blockchain) {
      return res.status(400).json({ message: 'Parametro blockchain obbligatorio' });
    }
    
    const analysis = await securityAnalyzer.analyzeContract(contractAddress, blockchain);
    
    res.status(200).json({
      analysis,
    });
  } catch (error) {
    console.error('Errore durante l\'analisi del token:', error);
    res.status(500).json({ message: 'Errore durante l\'analisi del token', error: error.message });
  }
});

// Aggiungi/Aggiorna token (solo admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Verifica che l'utente sia admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accesso non autorizzato. Solo gli admin possono aggiungere token' });
    }
    
    const { contractAddress, blockchain } = req.body;
    
    if (!contractAddress || !blockchain) {
      return res.status(400).json({ message: 'Indirizzo contratto e blockchain obbligatori' });
    }
    
    // Verifica se il token esiste giu00e0
    let token = await Token.findOne({ contractAddress, blockchain });
    
    if (token) {
      // Aggiorna il token esistente
      Object.assign(token, req.body);
      token.updatedAt = new Date();
      await token.save();
      
      return res.status(200).json({
        message: 'Token aggiornato con successo',
        token,
      });
    }
    
    // Crea nuovo token
    token = new Token(req.body);
    await token.save();
    
    res.status(201).json({
      message: 'Token aggiunto con successo',
      token,
    });
  } catch (error) {
    console.error('Errore durante l\'aggiunta/aggiornamento del token:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiunta/aggiornamento del token', error: error.message });
  }
});

module.exports = router;