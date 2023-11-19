import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', width: '100%' }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingPage;
