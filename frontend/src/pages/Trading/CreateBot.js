import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateBot = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mb: 3 }}>
        Indietro
      </Button>
      <Typography variant="h4" gutterBottom>Crea Nuovo Bot</Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Alert severity="info">
          La funzionalitu00e0 di creazione bot u00e8 in fase di sviluppo. Implementazione in arrivo.
        </Alert>
      </Paper>
    </Box>
  );
};

export default CreateBot;