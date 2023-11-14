import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import AuthEnabled from '../requests/getAuthEnabled';
import { Box } from '@mui/material';
import TwoFactorInput from '../components/TwoFactorInput';
import AuthVerify from '../requests/getAuthVerify';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  const queryString = window.location.search;
  const jwtParam = new URLSearchParams(queryString).get('jwt');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  useEffect(() => {
    AuthEnabled(jwtParam)
      .then((reqdata) => {
        console.log('data: ', reqdata);
        if (!reqdata && jwtParam !== null) {
          console.log('AUYIOFCBDYU*WEBYUBWDYUIKDBWYUIKBYU');
          Cookies.set('jwt', jwtParam);
          navigate('/');
        }
      })
      .catch((error) => {
        console.log(error);
        // return error page
      });
  }, []);
  /**
   * Handlers
   */
  const onTwoFactorTest = async (twoFactorCode: { text: string }): Promise<void> => {
    try {
      const verified = await AuthVerify(twoFactorCode.text);
      if (verified.data === true) {
        if (jwtParam != null) Cookies.set('jwt', jwtParam);
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
