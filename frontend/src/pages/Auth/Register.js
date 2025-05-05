import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  alpha,
  LinearProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { register, token } = useAuth();
  const theme = useTheme();
  
  // Se l'utente u00e8 giu00e0 loggato, reindirizza alla dashboard
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);
  
  // Controllo forza password
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Lunghezza minima
    if (password.length >= 8) strength += 25;
    
    // Caratteri speciali
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    
    // Lettere maiuscole e minuscole
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    
    // Numeri
    if (/[0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (password !== confirmPassword) {
      return setError('Le password non corrispondono');
    }

    if (password.length < 8) {
      return setError('La password deve essere di almeno 8 caratteri');
    }

    setLoading(true);

    try {
      const result = await register(username, email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Errore durante la registrazione. Riprova.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return theme.palette.error.main;
    if (passwordStrength < 50) return theme.palette.error.light;
    if (passwordStrength < 75) return theme.palette.warning.main;
    return theme.palette.success.main;
  };
  
  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Molto debole';
    if (passwordStrength < 50) return 'Debole';
    if (passwordStrength < 75) return 'Media';
    if (passwordStrength < 100) return 'Forte';
    return 'Molto forte';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.15)} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Blitz Trades
            </Typography>
            <Typography variant="h5" gutterBottom>
              Crea un nuovo account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Inizia a fare trading professionale di memecoin
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<ErrorOutlineIcon />}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />
            {password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Sicurezza password:
                  </Typography>
                  <Typography variant="caption" color={getPasswordStrengthColor()}>
                    {getPasswordStrengthText()}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  sx={{ 
                    height: 4,
                    borderRadius: 2,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getPasswordStrengthColor(),
                    }
                  }} 
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Usa almeno 8 caratteri con lettere maiuscole, minuscole, numeri e simboli
                </Typography>
              </Box>
            )}
            <TextField
              label="Conferma Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {password && confirmPassword && (
                      password === confirmPassword ? (
                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      ) : (
                        <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
                      )
                    )}
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 1, 
                mb: 3, 
                py: 1.2,
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
              disabled={loading || passwordStrength < 50}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Registrazione in corso...
                </>
              ) : (
                'Registrati'
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                oppure
              </Typography>
            </Divider>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2">
                  Hai giu00e0 un account?{' '}
                  <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                    Accedi
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;