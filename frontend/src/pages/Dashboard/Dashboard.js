import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip, 
  Avatar, 
  Divider, 
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PercentIcon from '@mui/icons-material/Percent';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
// Questi servizi saranno utilizzati in una implementazione completa
// import { tokenService, walletService, tradingService } from '../../services/api';

// Dati dei token realistici (simili a gmgn.ai)
const trendingTokens = [
  { 
    name: 'Pepe', 
    symbol: 'PEPE', 
    blockchain: 'ethereum', 
    price: 0.00000957, 
    priceChange24h: 15.6,
    marketCap: 4010000000,
    volume24h: 583000000,
    liquidity: 134000000,
    holders: 142879,
    contractAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    iconUrl: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg?1682922725',
    launchDate: '2023-04-18',
    safetyScore: 95,
    riskLevel: 'low',
    tags: ['meme', 'trending'],
    chart: [[1684693200000, 0.00000847], [1684779600000, 0.00000824], [1684866000000, 0.00000878], [1684952400000, 0.00000901], [1685038800000, 0.00000957]]
  },
  { 
    name: 'Brett', 
    symbol: 'BRETT', 
    blockchain: 'ethereum', 
    price: 0.00000234, 
    priceChange24h: 125.3,
    marketCap: 47800000,
    volume24h: 38500000,
    liquidity: 14500000,
    holders: 18754,
    contractAddress: '0xac55641cbb5b1fdcf4a7545a43caf7c6f8a22ee8',
    iconUrl: 'https://assets.coingecko.com/coins/images/33905/small/brett.jpg?1702556405',
    launchDate: '2023-12-07',
    safetyScore: 87,
    riskLevel: 'medium',
    tags: ['meme', 'trending', 'new'],
    chart: [[1684693200000, 0.00000104], [1684779600000, 0.00000143], [1684866000000, 0.00000156], [1684952400000, 0.00000189], [1685038800000, 0.00000234]]
  },
  { 
    name: 'Dogwifhat', 
    symbol: 'WIF', 
    blockchain: 'solana', 
    price: 2.45, 
    priceChange24h: -3.8,
    marketCap: 2450000000,
    volume24h: 187000000,
    liquidity: 98000000,
    holders: 89573,
    contractAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fHVF58iKuEfvhxJvT',
    iconUrl: 'https://assets.coingecko.com/coins/images/33868/small/wif.png?1702456050',
    launchDate: '2023-12-13',
    safetyScore: 92,
    riskLevel: 'low',
    tags: ['meme', 'solana', 'trending'],
    chart: [[1684693200000, 2.57], [1684779600000, 2.49], [1684866000000, 2.61], [1684952400000, 2.55], [1685038800000, 2.45]]
  },
  { 
    name: 'Book of Meme', 
    symbol: 'BOME', 
    blockchain: 'solana', 
    price: 0.0146, 
    priceChange24h: 8.9,
    marketCap: 2130000000,
    volume24h: 246000000,
    liquidity: 74500000,
    holders: 275894,
    contractAddress: 'A98UDy7z8MfmWnTQt6cKjje7UfqV3pTLf4yEbuwL2HvH',
    iconUrl: 'https://assets.coingecko.com/coins/images/34552/small/bome.png?1708402761',
    launchDate: '2024-03-16',
    safetyScore: 88,
    riskLevel: 'medium',
    tags: ['meme', 'solana', 'trending', 'new'],
    chart: [[1684693200000, 0.0134], [1684779600000, 0.0139], [1684866000000, 0.0141], [1684952400000, 0.0135], [1685038800000, 0.0146]]
  },
  { 
    name: 'Bonk', 
    symbol: 'BONK', 
    blockchain: 'solana', 
    price: 0.00002543, 
    priceChange24h: -1.2,
    marketCap: 1580000000,
    volume24h: 96000000,
    liquidity: 56000000,
    holders: 425783,
    contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    iconUrl: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg?1672304290',
    launchDate: '2022-12-25',
    safetyScore: 96,
    riskLevel: 'low',
    tags: ['meme', 'solana'],
    chart: [[1684693200000, 0.00002589], [1684779600000, 0.00002601], [1684866000000, 0.00002575], [1684952400000, 0.00002554], [1685038800000, 0.00002543]]
  },
  { 
    name: 'Mog Coin', 
    symbol: 'MOG', 
    blockchain: 'ethereum', 
    price: 0.00000478, 
    priceChange24h: 32.4,
    marketCap: 478000000,
    volume24h: 145000000,
    liquidity: 37500000,
    holders: 89426,
    contractAddress: '0xaafcfd42c9954c6689ef1901e03db742520908a9',
    iconUrl: 'https://assets.coingecko.com/coins/images/33956/small/mogcoin.png?1703042324',
    launchDate: '2023-12-19',
    safetyScore: 84,
    riskLevel: 'medium',
    tags: ['meme', 'ethereum', 'trending'],
    chart: [[1684693200000, 0.00000361], [1684779600000, 0.00000389], [1684866000000, 0.00000412], [1684952400000, 0.00000435], [1685038800000, 0.00000478]]
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topTokens, setTopTokens] = useState([]);
  const [userBots, setUserBots] = useState([]);
  const [smartWallets, setSmartWallets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, fetch data from APIs
        // For now, use dummy data
        setTopTokens(trendingTokens);
        
        // Dummy bots
        setUserBots([
          { id: 'bot1', name: 'Sniper Bot', type: 'sniper', status: 'active', performance: { totalProfitUSD: 230.5 } },
          { id: 'bot2', name: 'Copy Trader', type: 'copyTrading', status: 'paused', performance: { totalProfitUSD: 564.7 } },
        ]);
        
        // Dummy smart wallets
        setSmartWallets([
          { address: '0x123...abc', label: 'Whale 1', performance: { successRate: 85 } },
          { address: 'AaB...XyZ', label: 'Influencer 1', performance: { successRate: 92 } },
        ]);
        
        // Dummy transactions
        setRecentTransactions([
          { txHash: 'tx1', type: 'buy', tokenSymbol: 'PEPE', amount: 1000000, timestamp: new Date(Date.now() - 3600000) },
          { txHash: 'tx2', type: 'sell', tokenSymbol: 'DOGE', amount: 500, timestamp: new Date(Date.now() - 7200000) },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Errore durante il caricamento dei dati. Riprova più tardi.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price) => {
    return price < 0.001
      ? price.toExponential(4)
      : price.toFixed(price < 0.1 ? 6 : 4);
  };

  const handleViewMoreTokens = () => {
    navigate('/trending');
  };

  const handleViewMoreWallets = () => {
    navigate('/smart-wallets');
  };

  const handleViewMoreBots = () => {
    navigate('/bots');
  };

  const handleViewToken = (address) => {
    navigate(`/token/${address}`);
  };

  const handleViewWallet = (address) => {
    navigate(`/wallet/${address}`);
  };

  const handleViewBot = (id) => {
    navigate(`/bot/${id}`);
  };

  // Funzioni helper per formattare i numeri
  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    } else {
      return `$${(marketCap / 1000).toFixed(1)}K`;
    }
  };

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

  const getBlockchainName = (blockchain) => {
    switch (blockchain) {
      case 'ethereum':
        return 'ETH';
      case 'solana':
        return 'SOL';
      case 'binance_smart_chain':
        return 'BSC';
      default:
        return blockchain;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'high':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>Caricamento dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography color="error" variant="h5" gutterBottom>{error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()} startIcon={<RefreshIcon />}>
            Riprova
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Header con indicatori di mercato */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 3, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              borderRadius: 2,
              background: alpha(theme.palette.primary.main, 0.05),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), mr: 2 }}>
                <ShowChartIcon color="primary" />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Benvenuto in</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Blitz Trades Pro</Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">BTC Dominance</Typography>
                <Typography variant="h6">49.2%</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">ETH Gas</Typography>
                <Typography variant="h6">24 Gwei</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">SOL TPS</Typography>
                <Typography variant="h6">2,458</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Sentiment</Typography>
                <Typography variant="h6" color="success">Bullish</Typography>
              </Box>
              <IconButton color="primary">
                <RefreshIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Token Monitorati</Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>257</Typography>
                  <Typography variant="body2" color="success" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowDropUpIcon /> +12.4% questa settimana
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <Avatar 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                right: 20, 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                width: 60, 
                height: 60
              }}
            >
              <TrendingUpIcon color="primary" fontSize="large" />
            </Avatar>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Wallet Monitorati</Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>48</Typography>
                  <Typography variant="body2" color="success" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowDropUpIcon /> +5.2% questa settimana
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <Avatar 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                right: 20, 
                bgcolor: alpha(theme.palette.info.main, 0.1),
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                width: 60, 
                height: 60
              }}
            >
              <AccountBalanceWalletIcon color="info" fontSize="large" />
            </Avatar>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Bot Attivi</Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>{userBots.filter(b => b.status === 'active').length}</Typography>
                  <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowDropDownIcon /> -2 rispetto a ieri
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <Avatar 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                right: 20, 
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                width: 60, 
                height: 60
              }}
            >
              <SmartToyIcon color="warning" fontSize="large" />
            </Avatar>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 3, position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Profitto Totale</Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                    ${userBots.reduce((acc, bot) => acc + (bot.performance?.totalProfitUSD || 0), 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="success" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowDropUpIcon /> +8.3% questa settimana
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <Avatar 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                right: 20, 
                bgcolor: alpha(theme.palette.success.main, 0.1),
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                width: 60, 
                height: 60
              }}
            >
              <AttachMoneyIcon color="success" fontSize="large" />
            </Avatar>
          </Card>
        </Grid>
        
        {/* Trending Tokens */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Token di Tendenza</Typography>
                </Box>
              }
              action={
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={handleViewMoreTokens}
                  endIcon={<OpenInNewIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Vedi Tutti
                </Button>
              } 
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ overflowX: 'auto' }}>
                {topTokens.map((token, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      p: 2,
                      borderBottom: index < topTokens.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.05)}` : 'none',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03), cursor: 'pointer' },
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => handleViewToken(token.contractAddress)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Avatar 
                        src={token.iconUrl} 
                        alt={token.name}
                        sx={{ width: 40, height: 40, mr: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {token.name} 
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            {token.symbol}
                          </Typography>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Chip 
                            label={getBlockchainName(token.blockchain)}
                            size="small" 
                            sx={{ 
                              mr: 1, 
                              fontSize: '0.7rem',
                              bgcolor: alpha(getBlockchainColor(token.blockchain), 0.1),
                              color: getBlockchainColor(token.blockchain),
                              fontWeight: 'bold'
                            }} 
                          />
                          <Tooltip title={`Livello di rischio: ${token.riskLevel}`}>
                            <Chip 
                              label={`S ${token.safetyScore}`}
                              size="small" 
                              sx={{ 
                                fontSize: '0.7rem',
                                bgcolor: alpha(getRiskColor(token.riskLevel), 0.1),
                                color: getRiskColor(token.riskLevel),
                                fontWeight: 'bold'
                              }} 
                            />
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, flex: 1 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          ${formatPrice(token.price)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Box
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: token.priceChange24h >= 0 ? theme.palette.success.main : theme.palette.error.main,
                              bgcolor: token.priceChange24h >= 0 
                                ? alpha(theme.palette.success.main, 0.1) 
                                : alpha(theme.palette.error.main, 0.1),
                              borderRadius: 1,
                              px: 1,
                              py: 0.2
                            }}
                          >
                            {token.priceChange24h >= 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {Math.abs(token.priceChange24h).toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                        <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {formatMarketCap(token.marketCap)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                        <Typography variant="body2" color="text.secondary">24h Vol</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {formatMarketCap(token.volume24h)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Smart Wallets & Trading Activity */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceWalletIcon sx={{ mr: 1 }} color="info" />
                  <Typography variant="h6">Smart Money</Typography>
                </Box>
              }
              action={
                <Tooltip title="Ricarica wallet smart money">
                  <IconButton size="small" color="default" onClick={() => {}}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              } 
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {smartWallets.map((wallet, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2,
                    borderBottom: index < smartWallets.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.05)}` : 'none',
                    '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.03), cursor: 'pointer' },
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onClick={() => handleViewWallet(wallet.address)}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{wallet.label}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Chip 
                        label="Whale"
                        size="small" 
                        sx={{ 
                          mr: 1, 
                          fontSize: '0.7rem',
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {wallet.address.substring(0, 4)}...{wallet.address.substring(wallet.address.length - 4)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        borderRadius: 10,
                        px: 1.5,
                        py: 0.5
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <PercentIcon fontSize="small" sx={{ mr: 0.5 }} /> {wallet.performance.successRate}% 
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="info" 
                  size="small" 
                  onClick={handleViewMoreWallets}
                  endIcon={<OpenInNewIcon />}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Visualizza tutti i wallet
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Trading Bots */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SmartToyIcon sx={{ mr: 1 }} color="warning" />
                  <Typography variant="h6">I Tuoi Bot di Trading</Typography>
                </Box>
              }
              action={
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={handleViewMoreBots}
                  endIcon={<OpenInNewIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Vedi Tutti
                </Button>
              } 
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {userBots.length > 0 ? userBots.map((bot, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2,
                    borderBottom: index < userBots.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.05)}` : 'none',
                    '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.03), cursor: 'pointer' },
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onClick={() => handleViewBot(bot.id)}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{bot.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Chip 
                        label={bot.type === 'sniper' ? 'Sniper' : 
                               bot.type === 'copyTrading' ? 'Copy Trading' : 
                               bot.type === 'autoTrading' ? 'Auto Trading' : 'Limit Order'}
                        size="small" 
                        sx={{ 
                          mr: 1, 
                          fontSize: '0.7rem',
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main
                        }} 
                      />
                      <Chip 
                        label={bot.status === 'active' ? 'Attivo' : 
                               bot.status === 'paused' ? 'In pausa' : 'Fermato'}
                        size="small" 
                        color={bot.status === 'active' ? 'success' : 
                               bot.status === 'paused' ? 'warning' : 'error'}
                        sx={{ fontSize: '0.7rem' }} 
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography 
                      variant="subtitle1" 
                      color="success"
                      sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                    >
                      <ArrowDropUpIcon /> ${bot.performance.totalProfitUSD.toFixed(2)}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={70} 
                        sx={{ 
                          height: 4, 
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: theme.palette.success.main,
                          }
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
              )) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar 
                    sx={{ 
                      width: 70, 
                      height: 70, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.1)
                    }}
                  >
                    <SmartToyIcon color="warning" fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nessun bot attivo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 4 }}>
                    Crea il tuo primo bot di trading per automatizzare le tue strategie e massimizzare i profitti.
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<SmartToyIcon />}
                    onClick={() => navigate('/create-bot')}
                    sx={{ borderRadius: 2 }}
                  >
                    Crea Nuovo Bot
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyIcon sx={{ mr: 1 }} color="success" />
                  <Typography variant="h6">Transazioni Recenti</Typography>
                </Box>
              }
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Nuova transazione">
                    <IconButton size="small" color="primary">
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ricarica transazioni">
                    <IconButton size="small" color="default">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              } 
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {recentTransactions.length > 0 ? recentTransactions.map((tx, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2,
                    borderBottom: index < recentTransactions.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.05)}` : 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        mr: 2,
                        bgcolor: tx.type === 'buy' 
                          ? alpha(theme.palette.success.main, 0.1) 
                          : alpha(theme.palette.error.main, 0.1)
                      }}
                    >
                      {tx.type === 'buy' ? '+' : '-'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {tx.type === 'buy' ? 'Acquisto' : 'Vendita'} {tx.tokenSymbol}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(tx.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography 
                      variant="subtitle1" 
                      color={tx.type === 'buy' ? 'success' : 'error'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {tx.type === 'buy' ? '+' : '-'}{tx.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tx.txHash.substring(0, 6)}...{tx.txHash.substring(tx.txHash.length - 4)}
                    </Typography>
                  </Box>
                </Box>
              )) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar 
                    sx={{ 
                      width: 70, 
                      height: 70, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.1)
                    }}
                  >
                    <AttachMoneyIcon color="success" fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nessuna transazione recente
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 4 }}>
                    Le tue transazioni appariranno qui quando inizierai a fare trading.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;