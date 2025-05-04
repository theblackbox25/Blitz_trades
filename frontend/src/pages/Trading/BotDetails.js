import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mb: 3 }}>
        Indietro
      </Button>
      <Typography variant="h4" gutterBottom>Dettagli Bot</Typography>
      <Typography variant="body1" gutterBottom>
        ID Bot: {id}
      </Typography>
      <Alert severity="info" sx={{ mt: 3 }}>
        Questa funzionalitu00e0 u00e8 in fase di sviluppo. I dettagli completi del bot saranno implementati a breve.
      </Alert>
    </Box>
  );
};

export default BotDetails;