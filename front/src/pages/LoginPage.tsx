import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState();

  const onClick = (): void => {
    axios
      .request({
        url: 'https://api.intra.42.fr/oauth/token',
        method: 'post',
        baseURL: 'https://api.intra.42.fr/',
        auth: {
          username: 'u-s4t2ud-19e5bce000defc36a67ba010b01a62700de81e7f46c1611ccde06b4057bca6d5', // This is the client_id
          password: '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', // This is the client_secret
        },
        data: {
          grant_type: 'client_credentials',
          scope: 'public',
        },
      })
      .then((response) => {
        setToken(response.data);
        console.log(token);
      })
      .catch((e) => {
        console.log(e);
      });
    navigate('/');
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
      <Button variant="contained" onClick={onClick}>
        Login With 42API
      </Button>
    </div>
  );
};
export default LoginPage;
