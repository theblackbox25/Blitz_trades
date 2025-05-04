import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from '@mui/icons-material/Add';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { walletService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Placeholder components for charts
const PerformanceChart = () => (
  <Box sx={{ height: 300, bgcolor: 'background.paper', p: 2, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography variant="body1" color="text.secondary">Grafico Performance (placeholder)</Typography>
  </Box>
);

const ProfitChart = () => (
  <Box sx={{ height: 300, bgcolor: 'background.paper', p: 2, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography variant="body1" color="text.secondary">Grafico Profitti (placeholder)</Typography>
  </Box>
);

const WalletDetails = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [favoriteWallets, setFavoriteWallets] = useState(new Set());
  const [activeTab, setActiveTab] = useState(0);

  // Demo data for testing
  const demoWallet = {
    address: address,
    label: 'Whale Trader 1',
    blockchain: 'ethereum',
    categories: ['whales', 'successful_traders'],
    firstActivity: new Date(Date.now() - 3600000 * 24 * 30 * 3), // 3 months ago
    balance: {
      native: 45.32, // ETH
      usd: 158620, // USD value
      tokens: [
        { symbol: 'PEPE', amount: '123000000', value: 32450 },
        { symbol: 'SHIB', amount: '560000000', value: 28700 },
        { symbol: 'FLOKI', amount: '780000000', value: 19800 },
        { symbol: 'DOGE', amount: '65000', value: 8970 },
      ],
    },
    performance: {
      successRate: 92,
      avgROI: 320,
      totalTrades: 145,
      profitableTrades: 133,
      totalProfitUSD: 782340,
      bestTrade: {
        token: 'PEPE',
        roi: 980, // 980%
        date: new Date(Date.now() - 3600000 * 24 * 45), // 45 days ago
      },
    },
    recentActivity: {
      lastTrade: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      tokensBought: ['PEPE', 'FLOKI', 'SHIB'],
      tokensSold: ['DOGE'],
    },
  };

  // Demo transaction data
  const demoTransactions = [
    {
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
      token: 'PEPE',
      type: 'buy',
      amount: '50000000',
      price: 0.0000012,
      valueUSD: 60,
      timestamp: new Date(Date.now() - 3600000 * 2),
      profit: null, // Still holding
    },
    {
      txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      token: 'DOGE',
      type: 'sell',
      amount: '12000',
      price: 0.089,
      valueUSD: 1068,
      timestamp: new Date(Date.now() - 3600000 * 5),
      profit: 320, // 320 USD profit
    },
    {
      txHash: '0x7890abcdef1234567890abcdef1234567890abcd',
      token: 'SHIB',
      type: 'buy',
      amount: '120000000',
      price: 0.00001,
      valueUSD: 1200,
      timestamp: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
      profit: null, // Still holding
    },
    {
      txHash: '0xdef1234567890abcdef1234567890abcdef12345',
      token: 'ETH',
      type: 'receive',
      amount: '5.0',
      price: 3500,
      valueUSD: 17500,
      timestamp: new Date(Date.now() - 3600000 * 24 * 5), // 5 days ago
      profit: null, // Not applicable
    },
  ];

  useEffect(() => {
    fetchWalletData();
    
    // Load favorite wallets from localStorage
    const storedFavorites = localStorage.getItem('favoriteWallets');
    if (storedFavorites) {
      setFavoriteWallets(new Set(JSON.parse(storedFavorites)));
    }
  }, [address]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In una implementazione reale, qui chiameremmo le API
      // const walletDataResponse = await walletService.getWalletStats(address, 'ethereum');
      // const transactionsResponse = await walletService.getWalletTransactions(address, 'ethereum', 10);
      
      // Per questa demo, utilizziamo i dati di esempio
      setTimeout(() => {
        setWalletData(demoWallet);
        setTransactions(demoTransactions);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Errore durante il recupero dei dati del wallet. Riprova piu00f9 tardi.');
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toggleFavorite = () => {
    const newFavorites = new Set(favoriteWallets);
    if (newFavorites.has(address)) {
      newFavorites.delete(address);
    } else {
      newFavorites.add(address);
    }
    setFavoriteWallets(newFavorites);
    localStorage.setItem('favoriteWallets', JSON.stringify([...newFavorites]));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTrackWallet = async () => {
    if (!currentUser) {
      setError('Devi essere loggato per tracciare un wallet');
      return;
    }
    
    try {
      // In una implementazione reale, qui chiameremmo l'API
      // await walletService.trackWallet(address, walletData.blockchain);
      
      // Per questa demo, mostriamo solo un messaggio
      alert(`Wallet ${truncateAddress(address)} aggiunto al tracking`);
    } catch (err) {
      console.error('Error tracking wallet:', err);
      setError('Errore durante l\'aggiunta del wallet al tracking. Riprova piu00f9 tardi.');
    }
  };

  const truncateAddress = (addr) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  const getBlockchainColor = (blockchain) => {
    switch (blockchain) {
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'whales':
        return 'Whale';
      case 'influencers':
        return 'Influencer';
      case 'early_buyers':
        return 'Early Buyer';
      case 'successful_traders':
        return 'Successful Trader';
      default:
        return category;
    }
  };

  const getTransactionStatusColor = (type, profit) => {
    if (type === 'buy' || type === 'receive') return 'success.main';
    if (type === 'sell') {
      if (profit === null) return 'text.primary';
      return profit >= 0 ? 'success.main' : 'error.main';
    }
    return 'text.primary';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">Caricamento dati wallet...</Typography>
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

  if (!walletData) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mb: 3 }}>
          Indietro
        </Button>
        <Alert severity="warning">Nessun dato disponibile per questo wallet</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con azioni */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack} 
          sx={{ mr: 2 }}
        >
          Indietro
        </Button>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">
            {walletData.label || 'Dettagli Wallet'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              {address}
            </Typography>
            <Tooltip title={copySuccess ? 'Copiato!' : 'Copia indirizzo'}>
              <IconButton 
                size="small" 
                onClick={handleCopyAddress}
                color={copySuccess ? 'success' : 'default'}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Chip 
          label={walletData.blockchain}
          size="medium"
          sx={{ 
            mr: 2,
            bgcolor: getBlockchainColor(walletData.blockchain),
            color: walletData.blockchain === 'solana' ? 'black' : 'white',
          }}
        />
        
        <Tooltip title={favoriteWallets.has(address) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}>
          <IconButton 
            onClick={toggleFavorite}
            color={favoriteWallets.has(address) ? 'warning' : 'default'}
            sx={{ mr: 1 }}
          >
            {favoriteWallets.has(address) ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Tooltip>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleTrackWallet}
        >
          Traccia Wallet
        </Button>
      </Box>
      
      {/* Indicatori principali */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Bilancio Totale
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(walletData.balance.usd)}
            </Typography>
            <Typography variant="body2">
              {walletData.balance.native} {walletData.blockchain === 'ethereum' ? 'ETH' : walletData.blockchain === 'solana' ? 'SOL' : 'BNB'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Success Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 1 }}>
                {walletData.performance.successRate}%
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={walletData.performance.successRate} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>
            <Typography variant="body2">
              {walletData.performance.profitableTrades} su {walletData.performance.totalTrades} trade
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ROI Medio
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              +{walletData.performance.avgROI}%
            </Typography>
            <Typography variant="body2">
              Miglior trade: +{walletData.performance.bestTrade.roi}% ({walletData.performance.bestTrade.token})
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Profitto Totale
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {formatCurrency(walletData.performance.totalProfitUSD)}
            </Typography>
            <Typography variant="body2">
              Attivo da {new Date(walletData.firstActivity).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Categorie */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Categorie:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {walletData.categories.map((category, index) => (
            <Chip 
              key={index}
              label={getCategoryLabel(category)}
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
      
      {/* Tabs e contenuto principale */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" icon={<EqualizerIcon />} iconPosition="start" />
          <Tab label="Transazioni" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Asset" icon={<AccountBalanceWalletIcon />} iconPosition="start" />
          <Tab label="Analisi" icon={<AttachMoneyIcon />} iconPosition="start" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Tab 1: Overview */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Performance</Typography>
                <PerformanceChart />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Profitti</Typography>
                <ProfitChart />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Attivitu00e0 Recente</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Token</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell align="right">Valore</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.slice(0, 3).map((tx, index) => (
                        <TableRow key={index}>
                          <TableCell>{tx.token}</TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              color={getTransactionStatusColor(tx.type, tx.profit)}
                            >
                              {tx.type === 'buy' ? 'Acquisto' : tx.type === 'sell' ? 'Vendita' : 'Ricevuto'}
                            </Typography>
                          </TableCell>
                          <TableCell>{tx.timestamp.toLocaleString()}</TableCell>
                          <TableCell align="right">{formatCurrency(tx.valueUSD)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
          
          {/* Tab 2: Transazioni */}
          {activeTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hash</TableCell>
                    <TableCell>Token</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Quantitu00e0</TableCell>
                    <TableCell>Prezzo</TableCell>
                    <TableCell>Valore</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell align="right">Profitto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {truncateAddress(tx.txHash)}
                          </Typography>
                          <Tooltip title="Copia hash">
                            <IconButton size="small" onClick={() => navigator.clipboard.writeText(tx.txHash)}>
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>{tx.token}</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color={getTransactionStatusColor(tx.type, tx.profit)}
                        >
                          {tx.type === 'buy' ? 'Acquisto' : tx.type === 'sell' ? 'Vendita' : 'Ricevuto'}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Intl.NumberFormat().format(tx.amount)}</TableCell>
                      <TableCell>${tx.price < 0.0001 ? tx.price.toExponential(4) : tx.price.toFixed(6)}</TableCell>
                      <TableCell>{formatCurrency(tx.valueUSD)}</TableCell>
                      <TableCell>{tx.timestamp.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        {tx.profit !== null ? (
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={tx.profit >= 0 ? 'success.main' : 'error.main'}
                          >
                            {tx.profit >= 0 ? '+' : ''}{formatCurrency(tx.profit)}
                          </Typography>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {/* Tab 3: Asset */}
          {activeTab === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell>Quantitu00e0</TableCell>
                    <TableCell align="right">Valore</TableCell>
                    <TableCell align="right">% del Portfolio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {walletData.balance.tokens.map((token, index) => (
                    <TableRow key={index}>
                      <TableCell>{token.symbol}</TableCell>
                      <TableCell>{new Intl.NumberFormat().format(token.amount)}</TableCell>
                      <TableCell align="right">{formatCurrency(token.value)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {((token.value / walletData.balance.usd) * 100).toFixed(1)}%
                          </Typography>
                          <Box sx={{ width: 100 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={(token.value / walletData.balance.usd) * 100} 
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {/* Tab 4: Analisi */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Analisi avanzata in fase di sviluppo. Implementazione in arrivo.
                </Alert>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      
      {/* Informazioni aggiuntive */}
      <Card>
        <CardHeader title="Suggerimenti Trading" />
        <Divider />
        <CardContent>
          <Typography variant="body2" paragraph>
            Questo wallet ha dimostrato un'alta percentuale di successo nel trading di memecoin. 
            Considerare di monitorare le sue attivitu00e0 per identificare token emergenti con potenziale di crescita.
          </Typography>
          <Typography variant="body2" paragraph>
            Le transazioni piu00f9 recenti indicano un interesse per: {walletData.recentActivity.tokensBought.join(', ')}
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            L'utilizzo di questa funzionalitu00e0 per il copy trading u00e8 in fase di sviluppo.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WalletDetails;