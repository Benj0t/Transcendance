import React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const LoginPage: React.FC = () => {
  const handleLogin = (): void => {
    const url =
      'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-19e5bce000defc36a67ba010b01a62700de81e7f46c1611ccde06b4057bca6d5&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fauth%2Fcallback&response_type=code';
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
