import { Box } from '@mui/material';
import React from 'react';

const NoMatch: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', width: '100%' }}
    >
      <p style={{ fontSize: '100px' }}>404 Page Not Found</p>
    </Box>
  );
};

export default NoMatch;
