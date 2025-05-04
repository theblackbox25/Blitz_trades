import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Card, CardContent, CardHeader, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import SmartToyIcon from '@mui/icons-material/SmartToy';
// Questi servizi saranno utilizzati in una implementazione completa
// import { tokenService, walletService, tradingService } from '../../services/api';

// Dummy data
const trendingTokens = [
  { name: 'PeppeCoin', symbol: 'PEPE', blockchain: 'ethereum', price: 0.0000123, priceChange24h: 15.6 },
  { name: 'DOGE', symbol: 'DOGE', blockchain: 'ethereum', price: 0.123, priceChange24h: -2.3 },
  { name: 'Solana Doge', symbol: 'SDOGE', blockchain: 'solana', price: 0.00567, priceChange24h: 45.7 },
  { name: 'MoonShot', symbol: 'MOON', blockchain: 'ethereum', price: 0.000789, priceChange24h: 8.9 },
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

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>Caricamento dati...</Typography></Box>;
  }

  if (error) {
    return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Dashboard</Typography>
          </Box>
        </Grid>
        
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Token Monitorati</Typography>
                  <Typography variant="h5">257</Typography>
                </Box>
                <TrendingUpIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
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
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Bot Attivi</Typography>
                  <Typography variant="h5">{userBots.filter(b => b.status === 'active').length}</Typography>
                </Box>
                <SmartToyIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Profitto Totale</Typography>
                  <Typography variant="h5">
                    ${userBots.reduce((acc, bot) => acc + (bot.performance?.totalProfitUSD || 0), 0).toFixed(2)}
                  </Typography>
                </Box>
                <SecurityIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Trending Tokens */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Token di Tendenza" 
              action={
                <Button variant="text" onClick={handleViewMoreTokens}>Vedi Tutti</Button>
              } 
            />
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                {topTokens.map((token, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
                    }}
                    onClick={() => handleViewToken(`dummy-address-${index}`)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 2 }}>
                        <Typography variant="subtitle1">{token.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={token.blockchain} 
                            size="small" 
                            sx={{ mr: 1, fontSize: '0.7rem' }} 
                          />
                          <Typography variant="body2" color="text.secondary">
                            {token.symbol}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1">
                        ${formatPrice(token.price)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={token.priceChange24h >= 0 ? 'success.main' : 'error.main'}
                      >
                        {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Smart Wallets */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Smart Wallets" 
              action={
                <Button variant="text" onClick={handleViewMoreWallets}>Vedi Tutti</Button>
              } 
            />
            <CardContent>
              {smartWallets.map((wallet, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
                  }}
                  onClick={() => handleViewWallet(wallet.address)}
                >
                  <Box>
                    <Typography variant="subtitle1">{wallet.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">
                      {wallet.performance.successRate}% Success
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Trading Bots */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="I Tuoi Bot di Trading" 
              action={
                <Button variant="text" onClick={handleViewMoreBots}>Vedi Tutti</Button>
              } 
            />
            <CardContent>
              {userBots.length > 0 ? userBots.map((bot, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
                  }}
                  onClick={() => handleViewBot(bot.id)}
                >
                  <Box>
                    <Typography variant="subtitle1">{bot.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={bot.type} 
                        size="small" 
                        sx={{ mr: 1, fontSize: '0.7rem' }} 
                      />
                      <Chip 
                        label={bot.status} 
                        size="small" 
                        color={bot.status === 'active' ? 'success' : bot.status === 'paused' ? 'warning' : 'error'}
                        sx={{ fontSize: '0.7rem' }} 
                      />
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" color="primary">
                    +${bot.performance.totalProfitUSD.toFixed(2)}
                  </Typography>
                </Box>
              )) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Non hai ancora creato nessun bot
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<SmartToyIcon />}
                    onClick={() => navigate('/create-bot')}
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
          <Card>
            <CardHeader title="Transazioni Recenti" />
            <CardContent>
              {recentTransactions.length > 0 ? recentTransactions.map((tx, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      {tx.type === 'buy' ? 'Acquisto' : 'Vendita'} {tx.tokenSymbol}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(tx.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography 
                      variant="subtitle1" 
                      color={tx.type === 'buy' ? 'success.main' : 'error.main'}
                    >
                      {tx.type === 'buy' ? '+' : '-'}{tx.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tx.txHash.substring(0, 6)}...{tx.txHash.substring(tx.txHash.length - 4)}
                    </Typography>
                  </Box>
                </Box>
              )) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Nessuna transazione recente
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;