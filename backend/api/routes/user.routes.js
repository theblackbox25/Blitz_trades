const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user.model');
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

// Registrazione di un nuovo utente
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verifica che l'utente non esista già
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Utente o email già esistente' });
    }
    
    // Crea nuovo utente
    const user = new User({
      username,
      email,
      password, // La password verrà hashed dal middleware pre-save
      preferences: {
        theme: 'dark',
        notifications: {
          email: true,
          telegram: false,
          pushNotifications: true,
        },
        defaultSlippage: 0.5,
        defaultGasMultiplier: 1.5,
      },
    });
    
    // Salva l'utente
    await user.save();
    
    // Genera token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Ritorna token e info utente (senza password)
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(201).json({
      message: 'Utente registrato con successo',
      token,
      user: userObject,
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Errore durante la registrazione', error: error.message });
  }
});

// Login utente
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Cerca l'utente per email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    
    // Verifica la password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    
    // Aggiorna l'ultimo accesso
    user.lastLogin = new Date();
    await user.save();
    
    // Genera token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Ritorna token e info utente (senza password)
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(200).json({
      message: 'Login effettuato con successo',
      token,
      user: userObject,
    });
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Errore durante il login', error: error.message });
  }
});

// Ottieni profilo utente
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('Errore durante il recupero del profilo:', error);
    res.status(500).json({ message: 'Errore durante il recupero del profilo', error: error.message });
  }
});

// Aggiorna profilo utente
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, preferences } = req.body;
    
    // Verifica che non ci siano duplicati se username o email cambiano
    if (username || email) {
      const query = [];
      if (username) query.push({ username });
      if (email) query.push({ email });
      
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.user.id } },
          { $or: query },
        ],
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username o email già in uso' });
      }
    }
    
    // Aggiorna l'utente
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (preferences) updateData.preferences = preferences;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.status(200).json({
      message: 'Profilo aggiornato con successo',
      user,
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del profilo:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del profilo', error: error.message });
  }
});

// Modifica password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Recupera l'utente
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Verifica la password corrente
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password corrente non valida' });
    }
    
    // Aggiorna la password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      message: 'Password modificata con successo',
    });
  } catch (error) {
    console.error('Errore durante la modifica della password:', error);
    res.status(500).json({ message: 'Errore durante la modifica della password', error: error.message });
  }
});

// Aggiungi wallet
router.post('/wallets', authenticateToken, async (req, res) => {
  try {
    const { name, address, blockchain } = req.body;
    
    // Recupera l'utente
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Verifica che il wallet non sia già stato aggiunto
    const existingWallet = user.wallets.find(w => 
      w.address.toLowerCase() === address.toLowerCase() && w.blockchain === blockchain
    );
    
    if (existingWallet) {
      return res.status(400).json({ message: 'Wallet già aggiunto' });
    }
    
    // Aggiungi il wallet
    const isFirst = user.wallets.length === 0;
    user.wallets.push({
      name,
      address,
      blockchain,
      isConnected: true,
      default: isFirst, // Il primo wallet aggiunto è il default
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Wallet aggiunto con successo',
      wallets: user.wallets,
    });
  } catch (error) {
    console.error('Errore durante l\'aggiunta del wallet:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiunta del wallet', error: error.message });
  }
});

// Rimuovi wallet
router.delete('/wallets/:id', authenticateToken, async (req, res) => {
  try {
    // Recupera l'utente
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Trova l'indice del wallet da rimuovere
    const walletIndex = user.wallets.findIndex(w => w._id.toString() === req.params.id);
    if (walletIndex === -1) {
      return res.status(404).json({ message: 'Wallet non trovato' });
    }
    
    // Verifica se è il wallet di default
    const isDefault = user.wallets[walletIndex].default;
    
    // Rimuovi il wallet
    user.wallets.splice(walletIndex, 1);
    
    // Se era il wallet di default e ci sono altri wallet, imposta il primo come default
    if (isDefault && user.wallets.length > 0) {
      user.wallets[0].default = true;
    }
    
    await user.save();
    
    res.status(200).json({
      message: 'Wallet rimosso con successo',
      wallets: user.wallets,
    });
  } catch (error) {
    console.error('Errore durante la rimozione del wallet:', error);
    res.status(500).json({ message: 'Errore durante la rimozione del wallet', error: error.message });
  }
});

module.exports = router;