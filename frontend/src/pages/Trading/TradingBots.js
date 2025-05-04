import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const TradingBots = () => {
  const navigate = useNavigate();

  const handleCreateBot = () => {
    navigate('/create-bot');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Bot di Trading</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleCreateBot}
        >
          Crea Nuovo Bot
        </Button>
      </Box>
      <Alert severity="info">
        La funzionalitu00e0 dei bot di trading u00e8 in fase di sviluppo. Implementazione in arrivo.
      </Alert>
    </Box>
  );
};

export default TradingBots;