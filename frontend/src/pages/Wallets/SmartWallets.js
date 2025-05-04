import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const SmartWallets = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Smart Wallets</Typography>
      <Alert severity="info">
        Questa funzionalità è in fase di sviluppo. Implementazione in arrivo.
      </Alert>
    </Box>
  );
};

export default SmartWallets;