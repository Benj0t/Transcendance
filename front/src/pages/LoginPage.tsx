import React from 'react';
import Button from '@mui/material/Button';
import { bake_cookie } from 'sfcookies';

const LoginPage: React.FC = () => {
  const handleLogin = (): void => {
    const url =
      'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2c8d9db03c47fbff2b0498581e3badfacdf6e8a94f08c3c7338c2c5e27bb7f81&redirect_uri=http://localhost:8080/api/auth/callback&response_type=code&scope=public&state=a_very_long_random_string_witchmust_be_unguessable';
    bake_cookie('userIsAuth', 'true');
    window.location.href = url;
  };

  return (
    <div
      style={{
        margin: 0,
        position: 'absolute',
        left: '40%',
        top: '50%',
      }}
    >
      <Button variant="contained" onClick={handleLogin}>
        Login With 42API
      </Button>
    </div>
  );
};
export default LoginPage;
