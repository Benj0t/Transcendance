import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import AuthEnabled from '../requests/getAuthEnabled';
import { Box } from '@mui/material';
import TwoFactorInput from '../components/TwoFactorInput';
import AuthVerifyWithoutCookie from '../requests/getAuthVerifyWithoutCookies';
import LoadingPage from './LoadingPage';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  const queryString = window.location.search;
  const jwtParam = new URLSearchParams(queryString).get('jwt');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    AuthEnabled(jwtParam)
      .then((reqdata) => {
        if (!reqdata && jwtParam !== null) {
          Cookies.set('jwt', jwtParam);
          navigate('/settings');
        }
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  /**
   * Handlers
   */
  const onTwoFactorTest = async (twoFactorCode: { text: string }): Promise<void> => {
    try {
      const verified = await AuthVerifyWithoutCookie(twoFactorCode.text, jwtParam);
      if (verified === true) {
        if (jwtParam !== null) Cookies.set('jwt', jwtParam);
        navigate('/');
      }
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
  if (loading || error) return <LoadingPage />;
  return (
    <Box>
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
export default AuthCallback;
