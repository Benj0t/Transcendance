import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ProfileButton from '../components/profileButton';
import TwoFactorInput from '../components/TwoFactorInput';
import { useLocation, useNavigate } from 'react-router';
import AuthVerify from '../requests/getAuthVerify';

const ConfirmTwoFactor: React.FC = () => {
  /**
   * States
   */
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const param1 = params.get('param');
  const tmp = typeof param1 === 'string' ? param1 : '';
  const qrcode = decodeURIComponent(tmp);

  /**
   * Handlers
   */

  const onTwoFactorTest = async (twoFactorCode: { text: string }): Promise<void> => {
    try {
      const verified = await AuthVerify(twoFactorCode.text);
      if (verified.data === true) navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleTwoFactor = (): void => {
    if (twoFactorCode.trim() !== '') {
      void onTwoFactorTest({ text: twoFactorCode });
      setTwoFactorCode('');
    }
  };

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
          <img src={qrcode}></img>
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
