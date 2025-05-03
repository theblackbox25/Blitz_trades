import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import BlockIcon from '@mui/icons-material/Block';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { tokenService, tradingService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TokenDetails = () => {
  const { address } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const blockchain = searchParams.get('blockchain');
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [securityAnalysis, setSecurityAnalysis] = useState(null);
  
  // Trading state
  const [buyAmount, setBuyAmount] = useState('');
  const [executing, setExecuting] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  
  useEffect(() => {
    if (!blockchain) {
      setError('Blockchain parameter is required');
      setLoading(false);
      return;
    }
    
    fetchTokenDetails();
  }, [address, blockchain]);
  
  const fetchTokenDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tokenService.getTokenDetails(address, blockchain);
      setToken(response.token);
      
      // If security analysis is already included
      if (response.token?.securityAnalysis) {
        setSecurityAnalysis(response.token.securityAnalysis);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching token details:', err);
      setError('Errore durante il recupero dei dettagli del token. Riprova piu00f9 tardi.');
      setLoading(false);
    }
  };
  
  const analyzeTokenSecurity = async () => {
    try {
      setAnalyzeLoading(true);
      
      const response = await tokenService.analyzeTokenSecurity(address, blockchain);
      setSecurityAnalysis(response.analysis);
      
      setAnalyzeLoading(false);
    } catch (err) {
      console.error('Error analyzing token security:', err);
      setError('Errore durante l\'analisi della sicurezza del token. Riprova piu00f9 tardi.');
      setAnalyzeLoading(false);
    }
  };
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const getBlockchainColor = (chain) => {
    switch (chain) {
      case 'ethereum':
        return '#6B8AFF';
      case 'solana':
        return '#14F195';
      case 'binance_smart_chain':
        return '#F3BA2F';
      default:
        return '#9E9E9E';
    }
  };
  
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    
    return price < 0.001
      ? price.toExponential(4)
      : price.toFixed(price < 0.1 ? 6 : 4);
  };
  
  const formatLargeNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toString();
  };
  
  const getSecurityScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    if (score >= 40) return 'error.light';
    return 'error.main';
  };
  
  const executeBuy = async () => {
    if (!currentUser || !currentUser.wallets || currentUser.wallets.length === 0) {
      setError('Devi collegare un wallet per fare trading');
      return;
    }
    
    try {
      setExecuting(true);
      setTransactionResult(null);
      
      // In una implementazione reale, dovresti verificare che l'importo sia valido
      // e convertirlo in un formato appropriato
      const walletAddress = currentUser.wallets.find(w => w.default)?.address || currentUser.wallets[0].address;
      
      const response = await tradingService.executeTransaction({
        tokenAddress: address,
        blockchain,
        type: 'buy',
        amount: parseFloat(buyAmount),
        walletAddress
      });
      
      setTransactionResult({
        success: true,
        message: 'Transazione eseguita con successo',
        transaction: response.transaction
      });
      
      setBuyAmount('');
    } catch (err) {
      console.error('Error executing transaction:', err);
      setTransactionResult({
        success: false,
        message: 'Errore durante l\'esecuzione della transazione'
      });
    } finally {
      setExecuting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mb: 3 }}>
          Indietro
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  if (!token) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mb: 3 }}>
          Indietro
        </Button>
        <Alert severity="warning">Token non trovato</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Header con nome token e azioni */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mr: 2 }}>
          Indietro
        </Button>
        
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {token.name} ({token.symbol})
        </Typography>
        
        <Chip 
          label={token.blockchain}
          size="medium"
          sx={{ 
            mr: 2,
            bgcolor: getBlockchainColor(token.blockchain),
            color: token.blockchain === 'solana' ? 'black' : 'white',
          }}
        />
        
        <Tooltip title={copySuccess ? 'Copiato!' : 'Copia indirizzo'}>
          <IconButton onClick={handleCopyAddress} color={copySuccess ? 'success' : 'default'}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Contenuto principale */}
      <Grid container spacing={3}>
        {/* Informazioni principali */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Prezzo</Typography>
                <Typography variant="h6">${formatPrice(token.marketData?.price)}</Typography>
                <Typography 
                  variant="body2" 
                  color={token.marketData?.priceChange24h >= 0 ? 'success.main' : 'error.main'}
                >
                  {token.marketData?.priceChange24h >= 0 ? '+' : ''}
                  {token.marketData?.priceChange24h?.toFixed(2)}%
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                <Typography variant="h6">${formatLargeNumber(token.marketData?.marketCap)}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Volume 24h</Typography>
                <Typography variant="h6">${formatLargeNumber(token.marketData?.volume24h)}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">LiquiditÃ  USD</Typography>
                <Typography variant="h6">${formatLargeNumber(token.marketData?.liquidityUSD)}</Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Dettagli token */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dettagli Token
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Indirizzo Contratto</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', wordBreak: 'break-all' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {address}
                  </Typography>
                  <Tooltip title={copySuccess ? 'Copiato!' : 'Copia'}>
                    <IconButton size="small" onClick={handleCopyAddress} color={copySuccess ? 'success' : 'default'}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Blockchain</Typography>
                <Typography variant="body2">{token.blockchain}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Decimali</Typography>
                <Typography variant="body2">{token.decimals}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Offerta Totale</Typography>
                <Typography variant="body2">{formatLargeNumber(token.totalSupply)}</Typography>
              </Grid>
              
              {token.launchData && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Data Lancio</Typography>
                    <Typography variant="body2">
                      {token.launchData.launchDate ? new Date(token.launchData.launchDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Prezzo Iniziale</Typography>
                    <Typography variant="body2">${formatPrice(token.launchData.initialPrice)}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
          
          {/* Analisi sicurezza */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Analisi Sicurezza
              </Typography>
              
              {!securityAnalysis && !analyzeLoading && (
                <Button 
                  variant="outlined" 
                  startIcon={<SecurityIcon />}
                  onClick={analyzeTokenSecurity}
                >
                  Analizza Sicurezza
                </Button>
              )}
            </Box>
            
            {analyzeLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography>Analisi in corso...</Typography>
              </Box>
            ) : securityAnalysis ? (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Punteggio di Sicurezza
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ width: '100%', mr: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={securityAnalysis.securityScore} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          bgcolor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getSecurityScoreColor(securityAnalysis.securityScore),
                          },
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="body2" 
                      color={getSecurityScoreColor(securityAnalysis.securityScore)}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {securityAnalysis.securityScore}/100
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          {securityAnalysis.contractVerified ? 
                            <CheckCircleIcon color="success" /> : 
                            <ErrorIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Contratto Verificato" 
                          secondary={securityAnalysis.contractVerified ? 'Sì' : 'No'}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          {!securityAnalysis.isHoneypot ? 
                            <CheckCircleIcon color="success" /> : 
                            <ErrorIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Honeypot" 
                          secondary={securityAnalysis.isHoneypot ? 'Sì (Rischio)' : 'No'}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          {securityAnalysis.rugPullRisk === 'low' ? 
                            <CheckCircleIcon color="success" /> : 
                            securityAnalysis.rugPullRisk === 'medium' ?
                            <WarningIcon color="warning" /> :
                            <ErrorIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Rischio Rug Pull" 
                          secondary={securityAnalysis.rugPullRisk.charAt(0).toUpperCase() + securityAnalysis.rugPullRisk.slice(1)}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          {!securityAnalysis.hasOwnershipFunctions ? 
                            <CheckCircleIcon color="success" /> : 
                            <WarningIcon color="warning" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Funzioni Owner" 
                          secondary={securityAnalysis.hasOwnershipFunctions ? 'Presenti (Rischio)' : 'Non presenti'}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          {securityAnalysis.hasLiquidityLock ? 
                            <LockIcon color="success" /> : 
                            <BlockIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Liquiditu00e0 Bloccata" 
                          secondary={securityAnalysis.hasLiquidityLock ? 'Sì' : 'No (Rischio)'}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          {securityAnalysis.ownershipRenounced ? 
                            <CheckCircleIcon color="success" /> : 
                            <WarningIcon color="warning" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Proprietu00e0 Rinunciata" 
                          secondary={securityAnalysis.ownershipRenounced ? 'Sì' : 'No'}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
                
                {securityAnalysis.warningFlags && securityAnalysis.warningFlags.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                      Flag di Avviso:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {securityAnalysis.warningFlags.map((flag, index) => (
                        <Chip 
                          key={index} 
                          label={flag} 
                          size="small" 
                          color="error" 
                          icon={<WarningIcon />} 
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="text.secondary">
                  Nessuna analisi di sicurezza disponibile. Clicca su "Analizza Sicurezza" per verificare questo token.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Sidebar con azioni di trading */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Trading" 
              avatar={<SwapHorizIcon />}
              sx={{ pb: 1 }}
            />
            <CardContent>
              {currentUser ? (
                <Box>
                  <TextField
                    label="Importo da acquistare"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={executing || !buyAmount || parseFloat(buyAmount) <= 0}
                    onClick={executeBuy}
                    sx={{ mb: 2 }}
                  >
                    {executing ? <CircularProgress size={24} /> : 'Acquista'}
                  </Button>
                  
                  {transactionResult && (
                    <Alert 
                      severity={transactionResult.success ? 'success' : 'error'}
                      sx={{ mb: 2 }}
                    >
                      {transactionResult.message}
                    </Alert>
                  )}
                  
                  {securityAnalysis && securityAnalysis.rugPullRisk !== 'low' && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Questo token ha un rischio di sicurezza {securityAnalysis.rugPullRisk}. Investi con cautela.
                    </Alert>
                  )}
                </Box>
              ) : (
                <Alert severity="info">
                  Accedi per fare trading con questo token
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader 
              title="Informazioni sociali" 
              avatar={<PeopleIcon />}
              sx={{ pb: 1 }}
            />
            <CardContent>
              {token.socialData ? (
                <List dense>
                  {token.socialData.website && (
                    <ListItem>
                      <ListItemText 
                        primary="Website" 
                        secondary={
                          <a href={token.socialData.website} target="_blank" rel="noopener noreferrer">
                            {token.socialData.website}
                          </a>
                        } 
                      />
                    </ListItem>
                  )}
                  
                  {token.socialData.telegram && (
                    <ListItem>
                      <ListItemText 
                        primary="Telegram" 
                        secondary={
                          <a href={token.socialData.telegram} target="_blank" rel="noopener noreferrer">
                            {token.socialData.telegram}
                          </a>
                        } 
                      />
                    </ListItem>
                  )}
                  
                  {token.socialData.twitter && (
                    <ListItem>
                      <ListItemText 
                        primary="Twitter" 
                        secondary={
                          <a href={token.socialData.twitter} target="_blank" rel="noopener noreferrer">
                            {token.socialData.twitter}
                          </a>
                        } 
                      />
                    </ListItem>
                  )}
                  
                  {token.socialData.discord && (
                    <ListItem>
                      <ListItemText 
                        primary="Discord" 
                        secondary={
                          <a href={token.socialData.discord} target="_blank" rel="noopener noreferrer">
                            {token.socialData.discord}
                          </a>
                        } 
                      />
                    </ListItem>
                  )}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ py: 1 }}>
                  Nessuna informazione sociale disponibile
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TokenDetails;