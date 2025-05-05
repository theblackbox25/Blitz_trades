import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout components
import Layout from './components/Layout/Layout';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import TrendingTokens from './pages/Tokens/TrendingTokens';
import TokenDetails from './pages/Tokens/TokenDetails';
import SmartWallets from './pages/Wallets/SmartWallets.jsx';
import WalletDetails from './pages/Wallets/WalletDetails.jsx';
import TradingBots from './pages/Trading/TradingBots';
import BotDetails from './pages/Trading/BotDetails';
import CreateBot from './pages/Trading/CreateBot';
import UserProfile from './pages/User/UserProfile';
import Transactions from './pages/Transactions/Transactions';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Route guard for protected routes
const ProtectedRoute = ({ children }) => {
  // In a real app, this would check if the user is logged in
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="trending" element={<TrendingTokens />} />
            <Route path="token/:address" element={<TokenDetails />} />
            <Route path="smart-wallets" element={<SmartWallets />} />
            <Route path="wallet/:address" element={<WalletDetails />} />
            <Route path="bots" element={<TradingBots />} />
            <Route path="bot/:id" element={<BotDetails />} />
            <Route path="create-bot" element={<CreateBot />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;