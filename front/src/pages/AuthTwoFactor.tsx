import React, { useState } from 'react';
import { Box } from '@mui/material';
import ProfileButton from '../components/profileButton';
import TwoFactorInput from '../components/TwoFactorInput';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthTwoFactor: React.FC = () => {
  /**
   * States
   */
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const navigate = useNavigate();

  /**
   * Handlers
   */
  const onTwoFactorTest = (twoFactorCode: { text: string }): void => {
    const jwt = Cookies.get('jwt');
    if (jwt === undefined) navigate('/login');
    const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
    const requestData = {
      headers: {
        Authorization: authHeader,
      },
      params: {
        OTP: twoFactorCode.text,
      },
    };
    axios
      .get(`http://localhost:8080/api/auth/verify/`, requestData)
      .then((response) => {
        console.log(requestData.params.OTP);
        if (response.data === true) navigate('/');
      })
      .catch((error) => {
        console.error('Request Error: ', error);
      });
  };

  const handleTwoFactor = (): void => {
    if (twoFactorCode.trim() !== '') {
      onTwoFactorTest({ text: twoFactorCode });
      setTwoFactorCode('');
    }
  };
  return (
    <Box>
      <Box textAlign="right" sx={{ height: '100%', width: '100%' }}>
        <ProfileButton />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: '25%', height: '50%', width: '100%' }}
      >
        <TwoFactorInput
          twoFactorCode={twoFactorCode}
          setTwoFactorCode={setTwoFactorCode}
          handleTwoFactor={handleTwoFactor}
        />
      </Box>
    </Box>
  );
};
export default AuthTwoFactor;
