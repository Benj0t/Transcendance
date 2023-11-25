import React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = (): void => {
    navigate(
      '/auth/callback?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiYmVtb3JlYXUiLCJpYXQiOjE1MTYyMzkwMjJ9.N2jfjg2spwnnbzFFIiUaOrU8IryLofiPYSKGFqhNGTM',
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', width: '100%' }}
    >
      <Box marginTop="10vh">
        <Button variant="contained" onClick={handleLogin} style={{ width: 250, height: 100 }}>
          <h1>Login With 42API</h1>
        </Button>
      </Box>
    </Box>
  );
};
export default LoginPage;
