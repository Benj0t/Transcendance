import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { useNavigate } from 'react-router';
import AuthEnabled from '../requests/getAuthEnabled';
import AuthGenerate from '../requests/postAuthGenerate';
import LoadingPage from './LoadingPage';
import ProfileButton from '../components/profileButton';

const SettingsPage: React.FC = () => {
  const [avatar, setAvatar] = useState('');
  const [color, setColor] = useState('#aabbcc');
  const [name, setName] = useState('Benjot');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleEnableTwoFactor = async (): Promise<void> => {
    try {
      const qrcode = await AuthGenerate();
      if (qrcode !== '') navigate(`/ConfirmTwoFactor?param=${qrcode}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (color: string): void => {
    setColor(color);
  };

  const handleClickAvatar = (): void => {
    if (avatar !== 'https://cdn.intra.42.fr/users/cae6da7f6e8f7dcb7518c56b3c584ee2/bemoreau.jpg')
      setAvatar('https://cdn.intra.42.fr/users/cae6da7f6e8f7dcb7518c56b3c584ee2/bemoreau.jpg');
    else {
      setAvatar('');
    }
  };

  const handleLogTest = (): void => {
    navigate('/AuthTwoFactor');
  };

  useEffect(() => {
    AuthEnabled(null)
      .then((req) => {
        console.log(req);
        setTwoFactorEnabled(req);
      })
      .catch(() => {
        setError(true);
        console.log('coucou');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  console.log(twoFactorEnabled);
  if (error) return <p>Something bad happened</p>;
  if (loading) return <LoadingPage />;
  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        id="avatar"
        style={{
          position: 'absolute',
          top: '2%',
          left: '95%',
        }}
      >
        <ProfileButton />
      </Box>
      <Box
        width="80%"
        height="80%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <IconButton onClick={handleClickAvatar} size="large">
          <Avatar sx={{ width: 160, height: 160 }} src={avatar}>
            M
          </Avatar>
        </IconButton>
        <p>Cliquez pour modifier</p>
        <TextField
          id="outlined-controlled"
          label="Nom d'utilisateur"
          value={name}
          sx={{ input: { color: { color } } }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
        />
        <Box marginTop="1%">
          <MuiColorInput value={color} onChange={handleChange} />
        </Box>
        <Box marginTop="1%">
          <Button size="large" variant="outlined">
            Save
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={() => {
              void handleEnableTwoFactor();
            }}
            disabled={twoFactorEnabled}
          >
            Enable 2fa
          </Button>
          <Button size="large" variant="outlined" onClick={handleLogTest}>
            Test log
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
