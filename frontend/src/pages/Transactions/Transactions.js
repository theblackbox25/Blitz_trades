import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Transactions = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Transazioni</Typography>
      <Alert severity="info">
        La visualizzazione delle transazioni u00e8 in fase di sviluppo. Implementazione in arrivo.
      </Alert>
    </Box>
  );
};

export default Transactions;