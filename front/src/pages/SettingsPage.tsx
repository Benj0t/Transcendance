import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';

const SettingsPage: React.FC = () => {
  const [avatar, setAvatar] = useState('');
  const [color, setColor] = useState('#aabbcc');
  const [name, setName] = useState('Benjot');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const navigate = useNavigate();

  const handleEnableTwoFactor = (): void => {
    const jwt = Cookies.get('jwt');
    if (jwt === undefined) navigate('/login');
    const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
    const requestData = {
      headers: {
        Authorization: authHeader,
      },
    };
    axios
      .post(`http://localhost:8080/api/auth/generate/`, requestData)
      .then((response) => {
        const responseData = encodeURIComponent(response.data);
        navigate(`/ConfirmTwoFactor?param=${responseData}`);
      })
      .catch((error) => {
        console.error('Request Error: ', error);
      });
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
    axios
      .get(`http://localhost:8080/api/auth/enabled/`)
      .then((response) => {
        const ret = response.data;
        const boolret = typeof ret === 'boolean' ? ret : false;
        console.log(boolret);
        if (boolret) setTwoFactorEnabled(true);
        return boolret;
      })
      .catch((error) => {
        console.error('Request Error: ', error);
      });
  }, []);

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
            onClick={handleEnableTwoFactor}
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
