import React from 'react';
import { Box, Typography, Paper, Alert, Tabs, Tab } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const { currentUser } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Profilo Utente</Typography>
      
      {currentUser && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">{currentUser.username}</Typography>
          <Typography variant="body1" color="text.secondary">{currentUser.email}</Typography>
        </Box>
      )}
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Informazioni" />
          <Tab label="Wallet" />
          <Tab label="Preferenze" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Alert severity="info">
              La gestione del profilo u00e8 in fase di sviluppo. Implementazione in arrivo.
            </Alert>
          )}
          {tabValue === 1 && (
            <Alert severity="info">
              La gestione dei wallet u00e8 in fase di sviluppo. Implementazione in arrivo.
            </Alert>
          )}
          {tabValue === 2 && (
            <Alert severity="info">
              La gestione delle preferenze u00e8 in fase di sviluppo. Implementazione in arrivo.
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;