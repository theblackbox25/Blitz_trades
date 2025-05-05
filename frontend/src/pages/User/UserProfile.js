import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Alert, 
  Tabs, 
  Tab, 
  Grid, 
  Avatar, 
  Button, 
  TextField, 
  Divider, 
  Card, 
  CardContent, 
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const UserProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const { currentUser, updateProfile, changePassword, addWallet, removeWallet } = useAuth();
  const theme = useTheme();
  
  // Stati per i form di modifica
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    fullName: currentUser?.fullName || '',
    telegramUsername: currentUser?.telegramUsername || '',
  });
  
  // Stati per il cambio password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Stati per la gestione dei wallet
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    address: '',
    blockchain: 'ethereum',
  });
  const [deleteWalletId, setDeleteWalletId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Stati per notifiche e loading
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleWalletInputChange = (e) => {
    const { name, value } = e.target;
    setNewWallet(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleEditModeToggle = () => {
    if (editMode) {
      // Se stiamo uscendo dalla modalità modifica, ripristiniamo i dati originali
      setFormData({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        fullName: currentUser?.fullName || '',
        telegramUsername: currentUser?.telegramUsername || '',
      });
    }
    setEditMode(!editMode);
  };
  
  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setNotification({
          open: true,
          message: 'Profilo aggiornato con successo',
          severity: 'success',
        });
        setEditMode(false);
      } else {
        setNotification({
          open: true,
          message: result.message || 'Errore durante l\'aggiornamento del profilo',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del profilo:', error);
      setNotification({
        open: true,
        message: 'Errore di sistema. Riprova più tardi.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async () => {
    // Validazione
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        open: true,
        message: 'Le password non corrispondono',
        severity: 'error',
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setNotification({
        open: true,
        message: 'La nuova password deve essere di almeno 8 caratteri',
        severity: 'error',
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (result.success) {
        setNotification({
          open: true,
          message: 'Password aggiornata con successo',
          severity: 'success',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setNotification({
          open: true,
          message: result.message || 'Errore durante l\'aggiornamento della password',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della password:', error);
      setNotification({
        open: true,
        message: 'Errore di sistema. Riprova più tardi.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddWallet = async () => {
    if (!newWallet.name || !newWallet.address || !newWallet.blockchain) {
      setNotification({
        open: true,
        message: 'Tutti i campi sono obbligatori',
        severity: 'error',
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await addWallet(
        newWallet.name,
        newWallet.address,
        newWallet.blockchain
      );
      
      if (result.success) {
        setNotification({
          open: true,
          message: 'Wallet aggiunto con successo',
          severity: 'success',
        });
        setNewWallet({
          name: '',
          address: '',
          blockchain: 'ethereum',
        });
        setWalletDialogOpen(false);
      } else {
        setNotification({
          open: true,
          message: result.message || 'Errore durante l\'aggiunta del wallet',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Errore durante l\'aggiunta del wallet:', error);
      setNotification({
        open: true,
        message: 'Errore di sistema. Riprova più tardi.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveWallet = async () => {
    if (!deleteWalletId) return;
    
    setLoading(true);
    try {
      const result = await removeWallet(deleteWalletId);
      
      if (result.success) {
        setNotification({
          open: true,
          message: 'Wallet rimosso con successo',
          severity: 'success',
        });
        setDeleteDialogOpen(false);
        setDeleteWalletId(null);
      } else {
        setNotification({
          open: true,
          message: result.message || 'Errore durante la rimozione del wallet',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Errore durante la rimozione del wallet:', error);
      setNotification({
        open: true,
        message: 'Errore di sistema. Riprova più tardi.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  // Helper per ottenere il colore della blockchain
  const getBlockchainColor = (blockchain) => {
    switch (blockchain) {
      case 'ethereum':
        return '#627EEA';
      case 'solana':
        return '#14F195';
      case 'binance_smart_chain':
        return '#F3BA2F';
      default:
        return '#9E9E9E';
    }
  };
  
  // Helper per ottenere il nome della blockchain
  const getBlockchainName = (blockchain) => {
    switch (blockchain) {
      case 'ethereum':
        return 'Ethereum';
      case 'solana':
        return 'Solana';
      case 'binance_smart_chain':
        return 'BSC';
      default:
        return blockchain;
    }
  };
  
  // Helper per ottenere l'URL dell'explorer
  const getExplorerUrl = (blockchain, address) => {
    switch (blockchain) {
      case 'ethereum':
        return `https://etherscan.io/address/${address}`;
      case 'solana':
        return `https://solscan.io/account/${address}`;
      case 'binance_smart_chain':
        return `https://bscscan.com/address/${address}`;
      default:
        return '#';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderRadius: 3,
          flexWrap: 'wrap',
          gap: 2,
          background: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: alpha(theme.palette.primary.main, 0.1) 
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
          </Avatar>
          <Box>
            <Typography variant="h5">{currentUser?.username || 'Utente'}</Typography>
            <Typography variant="body1" color="text.secondary">{currentUser?.email || 'email@example.com'}</Typography>
            {currentUser?.fullName && (
              <Typography variant="body2">{currentUser.fullName}</Typography>
            )}
          </Box>
        </Box>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={handleEditModeToggle}
            color={editMode ? "error" : "primary"}
            sx={{ borderRadius: 2 }}
          >
            {editMode ? 'Annulla' : 'Modifica Profilo'}
          </Button>
        </Box>
      </Paper>
      
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.primary.main, 0.03)
          }}
        >
          <Tab 
            label="Informazioni" 
            icon={<AccountCircleIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Wallet" 
            icon={<AccountBalanceWalletIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Sicurezza" 
            icon={<SecurityIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Preferenze" 
            icon={<SettingsIcon />} 
            iconPosition="start"
          />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Tab Informazioni */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Informazioni Personali</Typography>
              <Divider sx={{ mb: 3 }} />
              
              {editMode ? (
                <Box component="form">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="normal"
                        disabled
                        helperText="L'email non può essere modificata"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nome Completo"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username Telegram"
                        name="telegramUsername"
                        value={formData.telegramUsername}
                        onChange={handleInputChange}
                        variant="outlined"
                        margin="normal"
                        placeholder="@username"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleProfileUpdate}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : null}
                          sx={{ borderRadius: 2 }}
                        >
                          Salva Modifiche
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                      <Typography variant="body1">{currentUser?.username || 'Non impostato'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{currentUser?.email || 'Non impostata'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Nome Completo</Typography>
                      <Typography variant="body1">{currentUser?.fullName || 'Non impostato'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Username Telegram</Typography>
                      <Typography variant="body1">{currentUser?.telegramUsername || 'Non impostato'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleEditModeToggle}
                        startIcon={<EditIcon />}
                        sx={{ borderRadius: 2 }}
                      >
                        Modifica
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
          
          {/* Tab Wallet */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">I Tuoi Wallet</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setWalletDialogOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Aggiungi Wallet
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {currentUser?.wallets && currentUser.wallets.length > 0 ? (
                <Grid container spacing={3}>
                  {currentUser.wallets.map((wallet) => (
                    <Grid item xs={12} md={6} key={wallet.id}>
                      <Card 
                        sx={{ 
                          borderRadius: 2,
                          border: `1px solid ${alpha(getBlockchainColor(wallet.blockchain), 0.3)}`,
                          bgcolor: alpha(getBlockchainColor(wallet.blockchain), 0.05)
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="h6" gutterBottom>{wallet.name}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Chip
                                  label={getBlockchainName(wallet.blockchain)}
                                  size="small"
                                  sx={{
                                    mr: 1,
                                    bgcolor: alpha(getBlockchainColor(wallet.blockchain), 0.1),
                                    color: getBlockchainColor(wallet.blockchain),
                                    fontWeight: 'bold'
                                  }}
                                />
                                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{wallet.address}</Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Tooltip title="Visualizza su Explorer">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => window.open(getExplorerUrl(wallet.blockchain, wallet.address), '_blank')}
                                >
                                  <LaunchIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rimuovi Wallet">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setDeleteWalletId(wallet.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.1)
                    }}
                  >
                    <AccountBalanceWalletIcon color="info" fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nessun wallet collegato
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 4 }}>
                    Aggiungi i tuoi wallet per monitorare le tue transazioni e i tuoi asset
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setWalletDialogOpen(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Aggiungi Wallet
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          {/* Tab Sicurezza */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Sicurezza</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Modifica Password</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password Attuale"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nuova Password"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        variant="outlined"
                        margin="normal"
                        helperText="Almeno 8 caratteri"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Conferma Nuova Password"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handlePasswordUpdate}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : null}
                          sx={{ borderRadius: 2 }}
                        >
                          Aggiorna Password
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Autenticazione a Due Fattori</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    L'autenticazione a due fattori aggiunge un livello di sicurezza aggiuntivo al tuo account richiedendo 
                    un secondo metodo di verifica oltre alla password.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 2 }}
                      disabled
                    >
                      Attiva 2FA
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Funzionalità in arrivo
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
          
          {/* Tab Preferenze */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Preferenze</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Notifiche</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Le impostazioni di notifica ti permettono di controllare quali avvisi ricevere e come.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 2 }}
                      disabled
                    >
                      Configura Notifiche
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Funzionalità in arrivo
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Temi e Visualizzazione</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Personalizza l'aspetto dell'interfaccia secondo le tue preferenze.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 2 }}
                      disabled
                    >
                      Cambia Tema
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Funzionalità in arrivo
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Dialog per l'aggiunta di un wallet */}
      <Dialog 
        open={walletDialogOpen} 
        onClose={() => setWalletDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Aggiungi Nuovo Wallet
          <IconButton onClick={() => setWalletDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome Wallet"
            name="name"
            value={newWallet.name}
            onChange={handleWalletInputChange}
            variant="outlined"
            margin="normal"
            placeholder="es. Portafoglio Principale"
          />
          <TextField
            fullWidth
            label="Indirizzo Wallet"
            name="address"
            value={newWallet.address}
            onChange={handleWalletInputChange}
            variant="outlined"
            margin="normal"
            placeholder="0x..."
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="blockchain-select-label">Blockchain</InputLabel>
            <Select
              labelId="blockchain-select-label"
              name="blockchain"
              value={newWallet.blockchain}
              onChange={handleWalletInputChange}
              label="Blockchain"
            >
              <MenuItem value="ethereum">Ethereum</MenuItem>
              <MenuItem value="solana">Solana</MenuItem>
              <MenuItem value="binance_smart_chain">Binance Smart Chain</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWalletDialogOpen(false)} color="error" sx={{ borderRadius: 2 }}>
            Annulla
          </Button>
          <Button 
            onClick={handleAddWallet} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ borderRadius: 2 }}
          >
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog per la conferma di eliminazione wallet */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>Sei sicuro di voler rimuovere questo wallet?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione non può essere annullata. Il wallet sarà rimosso dal tuo account, ma rimarrà attivo sulla blockchain.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 2 }}>
            Annulla
          </Button>
          <Button 
            onClick={handleRemoveWallet} 
            variant="contained" 
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ borderRadius: 2 }}
          >
            Rimuovi
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar per le notifiche */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity} 
          sx={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center',
            borderRadius: 2
          }}
          icon={notification.severity === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;