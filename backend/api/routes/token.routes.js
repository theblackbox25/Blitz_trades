const express = require('express');
const jwt = require('jsonwebtoken');
const Token = require('../../models/token.model');
const securityAnalyzer = require('../../services/securityAnalyzer.service');
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

// Ottieni lista token di tendenza
router.get('/trending', async (req, res) => {
  try {
    const { blockchain, limit = 10, offset = 0 } = req.query;
    
    // Prima cerca nel database
    let query = { isTrending: true };
    if (blockchain) {
      query.blockchain = blockchain;
    }
    
    let tokens = await Token.find(query)
      .sort({ 'marketData.volume24h': -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    
    // Se non ci sono abbastanza token nel database, recupera dati in tempo reale
    if (tokens.length < parseInt(limit)) {
      // Importa il servizio per i dati dei token
      const tokenDataService = require('../../services/tokenData.service');
      
      try {
        // Recupera i token di tendenza in tempo reale
        const trendingTokens = await tokenDataService.getTrendingTokens(
          blockchain, 
          parseInt(limit)
        );
        
        // Se abbiamo già alcuni token dal database, combina i risultati
        // Altrimenti usa solo i token recuperati in tempo reale
        if (tokens.length > 0) {
          // Filtra per evitare duplicati (in base all'indirizzo del contratto)
          const existingAddresses = new Set(tokens.map(t => t.contractAddress));
          const newTokens = trendingTokens.filter(t => !existingAddresses.has(t.contractAddress));
          
          // Aggiungi i nuovi token e limita al numero richiesto
          tokens = [...tokens, ...newTokens].slice(0, parseInt(limit));
        } else {
          tokens = trendingTokens;
        }
      } catch (serviceError) {
        console.error('Errore nel servizio di dati token:', serviceError);
        // Continua con i dati che abbiamo dal database
      }
    }
    
    const total = tokens.length;
    
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
    
    // Cerca nel database
    let tokens = await Token.find(query)
      .sort({ 'marketData.marketCap': -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    
    // Se non abbiamo trovato abbastanza risultati, prova la ricerca in tempo reale
    if (tokens.length < parseInt(limit)) {
      // Importa il servizio per i dati dei token
      const tokenDataService = require('../../services/tokenData.service');
      
      try {
        // Ricerca token in tempo reale
        const searchResults = await tokenDataService.searchTokens(
          q,
          blockchain,
          parseInt(limit)
        );
        
        // Se abbiamo giu00e0 alcuni token dal database, combina i risultati
        if (tokens.length > 0) {
          // Filtra per evitare duplicati
          const existingAddresses = new Set(tokens.map(t => t.contractAddress));
          const newTokens = searchResults.filter(t => !existingAddresses.has(t.contractAddress));
          
          // Aggiungi i nuovi token e limita al numero richiesto
          tokens = [...tokens, ...newTokens].slice(0, parseInt(limit));
        } else {
          tokens = searchResults;
        }
      } catch (serviceError) {
        console.error('Errore nel servizio di ricerca token:', serviceError);
        // Continua con i risultati dal database
      }
    }
    
    const total = tokens.length;
    
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
    
    if (!blockchain) {
      return res.status(400).json({ message: 'Parametro blockchain obbligatorio' });
    }
    
    // Importa i servizi necessari
    const tokenDataService = require('../../services/tokenData.service');
    
    // Cerca prima nel database
    let query = { contractAddress };
    query.blockchain = blockchain;
    
    let token = await Token.findOne(query);
    let tokenData = null;
    
    // Se il token non u00e8 nel database, recupera i dati in tempo reale
    if (!token) {
      try {
        // Recupera informazioni di base sul token
        const basicInfo = await tokenDataService.getTokenBasicInfo(contractAddress, blockchain);
        
        if (basicInfo) {
          // Recupera dati di mercato
          const marketData = await tokenDataService.getTokenMarketData(contractAddress, blockchain);
          
          // Analizza la sicurezza del contratto
          const securityAnalysis = await securityAnalyzer.analyzeContract(contractAddress, blockchain);
          
          // Combina tutte le informazioni
          tokenData = {
            ...basicInfo,
            marketData: marketData || basicInfo.marketData,
            securityAnalysis: securityAnalysis.success ? {
              isHoneypot: securityAnalysis.honeypotRisk === 'high',
              rugPullRisk: securityAnalysis.riskLevel,
              contractVerified: securityAnalysis.isVerified,
              hasOwnershipFunctions: securityAnalysis.hasOwnershipFunctions,
              warningFlags: securityAnalysis.suspiciousPatterns,
              securityScore: securityAnalysis.riskScore,
            } : null,
          };
          
          // Potresti voler salvare il token nel database per futuri accessi
          // In un'implementazione reale, questo verrebbe fatto in background
          try {
            const newToken = new Token(tokenData);
            await newToken.save();
            token = newToken;
          } catch (dbError) {
            console.error('Errore nel salvataggio del token nel database:', dbError);
            // Continua anche se il salvataggio fallisce
          }
        }
      } catch (lookupError) {
        console.error('Errore durante il recupero dei dati del token:', lookupError);
        // Se non siamo riusciti a recuperare il token, restituisci un errore
        if (!token && !tokenData) {
          return res.status(404).json({ message: 'Token non trovato o non valido' });
        }
      }
    }
    
    // Se abbiamo trovato il token nel database, aggiorna i dati di mercato se necessario
    if (token && token.marketData && token.marketData.lastUpdated) {
      const lastUpdateTime = new Date(token.marketData.lastUpdated).getTime();
      const currentTime = Date.now();
      const timeDifference = currentTime - lastUpdateTime;
      
      // Se i dati di mercato sono vecchi di più di 30 minuti, aggiornali
      if (timeDifference > 30 * 60 * 1000) {
        try {
          const freshMarketData = await tokenDataService.getTokenMarketData(contractAddress, blockchain);
          if (freshMarketData) {
            token.marketData = freshMarketData;
            token.updatedAt = new Date();
            await token.save();
          }
        } catch (marketDataError) {
          console.error('Errore durante l\'aggiornamento dei dati di mercato:', marketDataError);
          // Continua con i dati esistenti
        }
      }
    }
    
    // Restituisci i dati del token, con priorità al token dal database
    res.status(200).json({
      token: token || tokenData,
      fromDatabase: !!token,
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