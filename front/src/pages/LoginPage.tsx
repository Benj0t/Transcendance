import React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const LoginPage: React.FC = () => {
  const handleLogin = (): void => {
    const authUrl = process.env.REACT_APP_API_AUTH_URL ?? '';
    const clientId = process.env.REACT_APP_CLIENT_ID ?? '';
    const redirectUri = process.env.REACT_APP_REDIRECT_URI ?? '';
    const responseType = process.env.REACT_APP_RESPONSE_TYPE ?? '';

    const url = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`;
    console.log(url);
    window.location.href = url;
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
