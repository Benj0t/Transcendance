import React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = (): void => {
    const url =
      'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2c8d9db03c47fbff2b0498581e3badfacdf6e8a94f08c3c7338c2c5e27bb7f81&redirect_uri=http://localhost:8080/api/auth/callback&response_type=code&scope=public&state=a_very_long_random_string_wichmust_be_unguessable';
    window.location.href = url;
    navigate('/');
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
