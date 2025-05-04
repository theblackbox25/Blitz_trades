import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Pagination,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { walletService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Icone definite localmente per demo
const TrendingUpIcon = () => <span>📈</span>;
const CheckCircleIcon = () => <span>✅</span>;

const SmartWallets = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalWallets, setTotalWallets] = useState(0);
  const [walletsPerPage] = useState(10);
  const [copySuccess, setCopySuccess] = useState(null);
  const [favoriteWallets, setFavoriteWallets] = useState(new Set());

  // Placeholder data for demo
  const demoWallets = [
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      label: 'Whale Trader 1',
      blockchain: 'ethereum',
      categories: ['whales', 'successful_traders'],
      performance: {
        successRate: 92,
        avgROI: 320,
        totalTrades: 145,
        profitableTrades: 133,
      },
      recentActivity: {
        lastTrade: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        tokensBought: ['PEPE', 'FLOKI', 'SHIB'],
        tokensSold: ['DOGE'],
      }
    },
    {
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      label: 'Early Adopter 1',
      blockchain: 'ethereum',
      categories: ['early_buyers'],
      performance: {
        successRate: 78,
        avgROI: 450,
        totalTrades: 89,
        profitableTrades: 69,
      },
      recentActivity: {
        lastTrade: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        tokensBought: ['MOON', 'ELON'],
        tokensSold: [],
      }
    },
    {
      address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      label: 'Solana Whale 1',
      blockchain: 'solana',
      categories: ['whales'],
      performance: {
        successRate: 88,
        avgROI: 275,
        totalTrades: 112,
        profitableTrades: 98,
      },
      recentActivity: {
        lastTrade: new Date(Date.now() - 3600000 * 1), // 1 hour ago
        tokensBought: ['BONK', 'SAMO'],
        tokensSold: ['SDOGE'],
      }
    },
    {
      address: '0x7890abcdef1234567890abcdef1234567890abcd',
      label: 'Influencer 1',
      blockchain: 'ethereum',
      categories: ['influencers'],
      performance: {
        successRate: 81,
        avgROI: 190,
        totalTrades: 201,
        profitableTrades: 163,
      },
      recentActivity: {
        lastTrade: new Date(Date.now() - 3600000 * 24), // 24 hours ago
        tokensBought: ['PEPE', 'WOJAK'],
        tokensSold: ['FLOKI'],
      }
    },
    {
      address: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUu',
      label: 'Solana Sniper',
      blockchain: 'solana',
      categories: ['successful_traders', 'early_buyers'],
      performance: {
        successRate: 95,
        avgROI: 580,
        totalTrades: 65,
        profitableTrades: 62,
      },
      recentActivity: {
        lastTrade: new Date(Date.now() - 3600000 * 8), // 8 hours ago
        tokensBought: ['BONK', 'BERN'],
        tokensSold: [],
      }
    },
  ];

  useEffect(() => {
    fetchSmartWallets();
    
    // Load favorite wallets from localStorage
    const storedFavorites = localStorage.getItem('favoriteWallets');
    if (storedFavorites) {
      setFavoriteWallets(new Set(JSON.parse(storedFavorites)));
    }
  }, [selectedBlockchain, selectedCategory, page]);

  const fetchSmartWallets = async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * walletsPerPage;
      
      // In una vera implementazione, qui chiameremmo l'API
      // const blockchain = selectedBlockchain !== 'all' ? selectedBlockchain : null;
      // const category = selectedCategory !== 'all' ? selectedCategory : null;
      // const response = await walletService.getSmartMoneyWallets(blockchain, category, walletsPerPage, offset);
      
      // Per questa demo, utilizziamo i dati di esempio
      let filteredWallets = [...demoWallets];
      
      if (selectedBlockchain !== 'all') {
        filteredWallets = filteredWallets.filter(wallet => wallet.blockchain === selectedBlockchain);
      }
      
      if (selectedCategory !== 'all') {
        filteredWallets = filteredWallets.filter(wallet => wallet.categories.includes(selectedCategory));
      }
      
      // Simuliamo un breve ritardo di caricamento
      setTimeout(() => {
        setWallets(filteredWallets);
        setTotalWallets(filteredWallets.length);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching smart wallets:', err);
      setError('Errore durante il recupero dei wallet. Riprova più tardi.');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      setError(null);
      
      // In una vera implementazione, qui chiameremmo l'API di ricerca
      // Per questa demo, filtriamo i dati di esempio
      const query = searchQuery.toLowerCase();
      const filteredWallets = demoWallets.filter(wallet => 
        wallet.label.toLowerCase().includes(query) || 
        wallet.address.toLowerCase().includes(query)
      );
      
      setTimeout(() => {
        setWallets(filteredWallets);
        setTotalWallets(filteredWallets.length);
        setPage(1);
        setSearching(false);
      }, 500);
    } catch (err) {
      console.error('Error searching wallets:', err);
      setError('Errore durante la ricerca dei wallet. Riprova più tardi.');
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchSmartWallets();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewWallet = (address) => {
    navigate(`/wallet/${address}`);
  };

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopySuccess(address);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const toggleFavorite = (address) => {
    const newFavorites = new Set(favoriteWallets);
    if (newFavorites.has(address)) {
      newFavorites.delete(address);
    } else {
      newFavorites.add(address);
    }
    setFavoriteWallets(newFavorites);
    localStorage.setItem('favoriteWallets', JSON.stringify([...newFavorites]));
  };

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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

  const handleTrackWallet = async (address, blockchain) => {
    if (!currentUser) {
      setError('Devi essere loggato per tracciare un wallet');
      return;
    }
    
    try {
      // In una vera implementazione, qui chiameremmo l'API
      // await walletService.trackWallet(address, blockchain);
      
      // Per questa demo, mostriamo solo un messaggio
      alert(`Wallet ${truncateAddress(address)} aggiunto al tracking`);
    } catch (err) {
      console.error('Error tracking wallet:', err);
      setError('Errore durante l\'aggiunta del wallet al tracking. Riprova più tardi.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Smart Wallets</Typography>
      
      {/* Filtri e ricerca */}
      <Box sx={{ my: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="blockchain-select-label">Blockchain</InputLabel>
          <Select
            labelId="blockchain-select-label"
            value={selectedBlockchain}
            label="Blockchain"
            onChange={(e) => setSelectedBlockchain(e.target.value)}
          >
            <MenuItem value="all">Tutte</MenuItem>
            <MenuItem value="ethereum">Ethereum</MenuItem>
            <MenuItem value="solana">Solana</MenuItem>
            <MenuItem value="binance_smart_chain">Binance</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="category-select-label">Categoria</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label="Categoria"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">Tutte</MenuItem>
            <MenuItem value="whales">Whales</MenuItem>
            <MenuItem value="influencers">Influencers</MenuItem>
            <MenuItem value="early_buyers">Early Buyers</MenuItem>
            <MenuItem value="successful_traders">Successful Traders</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', flexGrow: 1, gap: 1 }}>
          <TextField
            placeholder="Cerca per nome o indirizzo"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
          >
            {searching ? <CircularProgress size={24} /> : 'Cerca'}
          </Button>
          {searchQuery && (
            <Button 
              variant="outlined" 
              onClick={handleClearSearch}
              disabled={searching}
            >
              Cancella
            </Button>
          )}
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Statistiche */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Wallet Monitorati</Typography>
                  <Typography variant="h5">48</Typography>
                </Box>
                <AccountBalanceWalletIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Wallet Preferiti</Typography>
                  <Typography variant="h5">{favoriteWallets.size}</Typography>
                </Box>
                <StarIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Miglior Wallet ROI</Typography>
                  <Typography variant="h5">+580%</Typography>
                </Box>
                <TrendingUpIcon />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Miglior Success Rate</Typography>
                  <Typography variant="h5">95%</Typography>
                </Box>
                <CheckCircleIcon />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabella wallet */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Blockchain</TableCell>
              <TableCell>Categorie</TableCell>
              <TableCell>Success Rate</TableCell>
              <TableCell>Avg ROI</TableCell>
              <TableCell>Ultima Attività</TableCell>
              <TableCell align="right">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={40} sx={{ my: 3 }} />
                </TableCell>
              </TableRow>
            ) : wallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ my: 3 }}>
                    Nessun wallet trovato
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              wallets.map((wallet, index) => (
                <TableRow 
                  key={index} 
                  hover 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => handleViewWallet(wallet.address)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant="body1">{wallet.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {truncateAddress(wallet.address)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={wallet.blockchain}
                      size="small"
                      sx={{ 
                        bgcolor: getBlockchainColor(wallet.blockchain),
                        color: wallet.blockchain === 'solana' ? 'black' : 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {wallet.categories.map((category, i) => (
                        <Chip 
                          key={i}
                          label={getCategoryLabel(category)}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color={wallet.performance.successRate >= 80 ? 'success.main' : 'text.primary'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {wallet.performance.successRate}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color="success.main"
                      sx={{ fontWeight: 'bold' }}
                    >
                      +{wallet.performance.avgROI}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {wallet.recentActivity.lastTrade.toLocaleTimeString()}
                    </Typography>
                    {wallet.recentActivity.tokensBought.length > 0 && (
                      <Typography variant="body2" color="success.main" sx={{ fontSize: '0.75rem' }}>
                        Bought: {wallet.recentActivity.tokensBought.join(', ')}
                      </Typography>
                    )}
                    {wallet.recentActivity.tokensSold.length > 0 && (
                      <Typography variant="body2" color="error.main" sx={{ fontSize: '0.75rem' }}>
                        Sold: {wallet.recentActivity.tokensSold.join(', ')}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title={favoriteWallets.has(wallet.address) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(wallet.address);
                          }}
                          color={favoriteWallets.has(wallet.address) ? 'warning' : 'default'}
                        >
                          {favoriteWallets.has(wallet.address) ? 
                            <StarIcon fontSize="small" /> : 
                            <StarBorderIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copia indirizzo">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyAddress(wallet.address);
                          }}
                          color={copySuccess === wallet.address ? 'success' : 'default'}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Visualizza dettagli">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewWallet(wallet.address);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Traccia wallet">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackWallet(wallet.address, wallet.blockchain);
                          }}
                          color="primary"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Paginazione */}
      {totalWallets > walletsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={Math.ceil(totalWallets / walletsPerPage)} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
      
      {/* Info box */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title="Come funziona" />
        <Divider />
        <CardContent>
          <Typography variant="body2" paragraph>
            La funzionalità Smart Wallets ti permette di monitorare gli indirizzi di trader esperti e di successo su diverse blockchain.
          </Typography>
          <Typography variant="body2" paragraph>
            Puoi tracciare i loro movimenti, copiare le loro strategie di trading e ricevere notifiche quando effettuano transazioni significative.
          </Typography>
          <Typography variant="body2">
            Utilizza i filtri per blockchain e categoria per trovare i wallet più rilevanti per la tua strategia di trading.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SmartWallets;