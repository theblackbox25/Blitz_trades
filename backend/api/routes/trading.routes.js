const express = require('express');
const jwt = require('jsonwebtoken');
const tradingBotService = require('../../services/tradingBot.service');
const TradingBot = require('../../models/tradingBot.model');
const Transaction = require('../../models/transaction.model');
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

// Ottieni lista dei bot dell'utente
router.get('/bots', authenticateToken, async (req, res) => {
  try {
    const userBots = tradingBotService.getUserBots(req.user.id);
    
    res.status(200).json({
      bots: userBots,
    });
  } catch (error) {
    console.error('Errore durante il recupero dei bot:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei bot', error: error.message });
  }
});

// Ottieni dettagli di un bot specifico
router.get('/bots/:id', authenticateToken, async (req, res) => {
  try {
    const botDetails = tradingBotService.getBotDetails(req.params.id, req.user.id);
    
    res.status(200).json({
      bot: botDetails,
    });
  } catch (error) {
    console.error('Errore durante il recupero dei dettagli del bot:', error);
    
    if (error.message.includes('Bot not found') || error.message.includes('Unauthorized')) {
      return res.status(404).json({ message: 'Bot non trovato o non autorizzato' });
    }
    
    res.status(500).json({ message: 'Errore durante il recupero dei dettagli del bot', error: error.message });
  }
});

// Crea un nuovo bot di trading
router.post('/bots', authenticateToken, async (req, res) => {
  try {
    const { name, type, blockchain, walletAddress, config } = req.body;
    
    if (!name || !type || !blockchain || !walletAddress || !config) {
      return res.status(400).json({ message: 'Parametri mancanti. Richiesti: name, type, blockchain, walletAddress, config' });
    }
    
    // Verifica il tipo di bot
    const validTypes = ['sniper', 'copyTrading', 'autoTrading', 'limitOrder'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Tipo di bot non valido. Valori consentiti: ${validTypes.join(', ')}` });
    }
    
    // Verifica la blockchain
    const validBlockchains = ['solana', 'ethereum', 'binance_smart_chain'];
    if (!validBlockchains.includes(blockchain)) {
      return res.status(400).json({ message: `Blockchain non valida. Valori consentiti: ${validBlockchains.join(', ')}` });
    }
    
    // Crea il bot
    const botResult = await tradingBotService.createBot({
      name,
      type,
      blockchain,
      walletAddress,
      ...config,
    }, req.user.id);
    
    if (!botResult.success) {
      return res.status(400).json({ message: 'Errore durante la creazione del bot', error: botResult.error });
    }
    
    res.status(201).json({
      message: 'Bot creato con successo',
      botId: botResult.botId,
    });
  } catch (error) {
    console.error('Errore durante la creazione del bot:', error);
    res.status(500).json({ message: 'Errore durante la creazione del bot', error: error.message });
  }
});

// Ferma un bot di trading
router.post('/bots/:id/stop', authenticateToken, async (req, res) => {
  try {
    const result = tradingBotService.stopBot(req.params.id, req.user.id);
    
    res.status(200).json({
      message: 'Bot fermato con successo',
    });
  } catch (error) {
    console.error('Errore durante l\'arresto del bot:', error);
    
    if (error.message.includes('Bot not found') || error.message.includes('Unauthorized')) {
      return res.status(404).json({ message: 'Bot non trovato o non autorizzato' });
    }
    
    res.status(500).json({ message: 'Errore durante l\'arresto del bot', error: error.message });
  }
});

// Avvia un bot precedentemente fermato
router.post('/bots/:id/start', authenticateToken, async (req, res) => {
  try {
    // Recupera il bot
    const bot = tradingBotService.getBotDetails(req.params.id, req.user.id);
    
    if (bot.status === 'active') {
      return res.status(400).json({ message: 'Il bot u00e8 giu00e0 attivo' });
    }
    
    if (bot.status === 'completed') {
      return res.status(400).json({ message: 'Il bot ha completato la sua operazione e non puu00f2 essere riavviato' });
    }
    
    // Riavvia il bot
    bot.status = 'active';
    tradingBotService.startBotMonitoring(req.params.id);
    
    res.status(200).json({
      message: 'Bot avviato con successo',
    });
  } catch (error) {
    console.error('Errore durante l\'avvio del bot:', error);
    
    if (error.message.includes('Bot not found') || error.message.includes('Unauthorized')) {
      return res.status(404).json({ message: 'Bot non trovato o non autorizzato' });
    }
    
    res.status(500).json({ message: 'Errore durante l\'avvio del bot', error: error.message });
  }
});

// Ottieni le transazioni dell'utente
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0, status, type, blockchain } = req.query;
    
    let query = { user: req.user.id };
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (blockchain) query.blockchain = blockchain;
    
    // In un'implementazione reale, utilizzare il modello Transaction
    // const transactions = await Transaction.find(query)
    //   .sort({ timestamp: -1 })
    //   .skip(parseInt(offset))
    //   .limit(parseInt(limit));
    // 
    // const total = await Transaction.countDocuments(query);
    
    // Placeholder semplificato
    const transactions = [];
    const total = 0;
    
    res.status(200).json({
      transactions,
      pagination: {
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Errore durante il recupero delle transazioni:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle transazioni', error: error.message });
  }
});

// Esegui una transazione manuale
router.post('/execute', authenticateToken, async (req, res) => {
  try {
    const { tokenAddress, blockchain, type, amount, walletAddress } = req.body;
    
    if (!tokenAddress || !blockchain || !type || !amount || !walletAddress) {
      return res.status(400).json({ message: 'Parametri mancanti' });
    }
    
    // Verifica il tipo di transazione
    if (!['buy', 'sell'].includes(type)) {
      return res.status(400).json({ message: 'Tipo di transazione non valido. Valori consentiti: buy, sell' });
    }
    
    // In un'implementazione reale, eseguire la transazione usando i servizi appropriati
    // const result = type === 'buy'
    //   ? await tradingBotService.executeBuy(tokenAddress, amount, blockchain, {})
    //   : await tradingBotService.executeSell(tokenAddress, amount, blockchain, {});
    
    // Placeholder semplificato
    const result = {
      success: true,
      transaction: {
        tokenAddress,
        amount,
        blockchain,
        type,
        status: 'completed',
        txHash: `tx_${Date.now()}`,
        timestamp: new Date(),
        price: 0.0001, // Prezzo esempio
        fees: {
          networkFee: 0.001,
          platformFee: 0.0005,
        },
      },
    };
    
    if (!result.success) {
      return res.status(400).json({ message: 'Errore durante l\'esecuzione della transazione', error: result.error });
    }
    
    // In un'implementazione reale, salvare la transazione nel database
    // const transaction = new Transaction({
    //   user: req.user.id,
    //   tokenAddress: result.transaction.tokenAddress,
    //   blockchain: result.transaction.blockchain,
    //   type: result.transaction.type,
    //   amount: result.transaction.amount,
    //   txHash: result.transaction.txHash,
    //   timestamp: result.transaction.timestamp,
    //   status: result.transaction.status,
    //   walletAddress,
    //   isAutomated: false,
    //   fees: result.transaction.fees,
    // });
    // 
    // await transaction.save();
    
    res.status(200).json({
      message: 'Transazione eseguita con successo',
      transaction: result.transaction,
    });
  } catch (error) {
    console.error('Errore durante l\'esecuzione della transazione:', error);
    res.status(500).json({ message: 'Errore durante l\'esecuzione della transazione', error: error.message });
  }
});

module.exports = router;