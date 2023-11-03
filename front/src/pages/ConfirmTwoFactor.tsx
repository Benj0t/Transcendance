import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ProfileButton from '../components/profileButton';
import TwoFactorInput from '../components/TwoFactorInput';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';

const ConfirmTwoFactor: React.FC = () => {
  /**
   * States
   */
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const param1 = params.get('param');
  console.log('test');
  console.log(param1);

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
        if (response.data === true) navigate('/'); // TODO Set twofactorenable boolean to true
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
  // TODO change img with qrcode from db
  return (
    <Box>
      <Box textAlign="right" sx={{ height: '100%', width: '100%' }}>
        <ProfileButton />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: '10%', height: '50%', width: '100%' }}
        >
          <img src="data:image/png;base64,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"></img>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: '0%', height: '50%', width: '100%' }}
        >
          <Typography fontSize="2vw">
            Scan this qrcode with Google Authenticator app and enter your temporary code to confirm
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: '10%', height: '50%', width: '100%' }}
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

export default ConfirmTwoFactor;
