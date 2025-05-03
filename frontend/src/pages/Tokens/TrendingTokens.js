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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import { tokenService } from '../../services/api';

const TrendingTokens = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState('all');
  const [page, setPage] = useState(1);
  const [totalTokens, setTotalTokens] = useState(0);
  const [tokensPerPage] = useState(10);
  const [copySuccess, setCopySuccess] = useState(null);

  useEffect(() => {
    fetchTrendingTokens();
  }, [selectedBlockchain, page]);

  const fetchTrendingTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * tokensPerPage;
      const blockchain = selectedBlockchain !== 'all' ? selectedBlockchain : null;
      
      const response = await tokenService.getTrending(blockchain, tokensPerPage, offset);
      
      setTokens(response.tokens);
      setTotalTokens(response.pagination.total);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trending tokens:', err);
      setError('Errore durante il recupero dei token. Riprova piu00f9 tardi.');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      setError(null);
      const blockchain = selectedBlockchain !== 'all' ? selectedBlockchain : null;
      
      const response = await tokenService.searchTokens(searchQuery, blockchain, tokensPerPage, 0);
      
      setTokens(response.tokens);
      setTotalTokens(response.pagination.total);
      setPage(1);
      setSearching(false);
    } catch (err) {
      console.error('Error searching tokens:', err);
      setError('Errore durante la ricerca dei token. Riprova piu00f9 tardi.');
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchTrendingTokens();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewToken = (contractAddress, blockchain) => {
    navigate(`/token/${contractAddress}?blockchain=${blockchain}`);
  };

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopySuccess(address);
    setTimeout(() => setCopySuccess(null), 2000);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Token di Tendenza</Typography>
      
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
        
        <Box sx={{ display: 'flex', flexGrow: 1, gap: 1 }}>
          <TextField
            placeholder="Cerca per nome o simbolo"
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
        
        <Tooltip title="Aggiorna">
          <IconButton 
            onClick={fetchTrendingTokens} 
            disabled={loading}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Tabella token */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Blockchain</TableCell>
              <TableCell>Prezzo (USD)</TableCell>
              <TableCell>Variazione 24h</TableCell>
              <TableCell>Volume 24h</TableCell>
              <TableCell align="right">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={40} sx={{ my: 3 }} />
                </TableCell>
              </TableRow>
            ) : tokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ my: 3 }}>
                    Nessun token trovato
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tokens.map((token, index) => (
                <TableRow 
                  key={index} 
                  hover 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => handleViewToken(token.contractAddress, token.blockchain)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant="body1">{token.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {token.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={token.blockchain}
                      size="small"
                      sx={{ 
                        bgcolor: getBlockchainColor(token.blockchain),
                        color: token.blockchain === 'solana' ? 'black' : 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    ${formatPrice(token.marketData?.price)}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color={token.marketData?.priceChange24h >= 0 ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {token.marketData?.priceChange24h >= 0 ? '+' : ''}
                      {token.marketData?.priceChange24h?.toFixed(2)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    ${formatLargeNumber(token.marketData?.volume24h)}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Copia indirizzo">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyAddress(token.contractAddress);
                          }}
                          color={copySuccess === token.contractAddress ? 'success' : 'default'}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Analisi sicurezza">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewToken(token.contractAddress, token.blockchain);
                          }}
                        >
                          <SecurityIcon fontSize="small" />
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
      {totalTokens > tokensPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={Math.ceil(totalTokens / tokensPerPage)} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </Box>
  );
};

export default TrendingTokens;