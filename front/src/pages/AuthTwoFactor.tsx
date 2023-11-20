import React, { useState } from 'react';
import { Box } from '@mui/material';
import ProfileButton from '../components/profileButton';
import TwoFactorInput from '../components/TwoFactorInput';
import AuthVerify from '../requests/getAuthVerify';
import { useNavigate } from 'react-router';

const AuthTwoFactor: React.FC = () => {
  /**
   * States
   */
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const navigate = useNavigate();

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
