import React, { useState } from 'react';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { read_cookie } from 'sfcookies';

// const axiosConfig = {
//   baseURL: 'http://localhost',
//   port: 8080,
// };

// const instance = axios.create(axiosConfig);
const jwtParam = read_cookie('jwt');

const SettingsPage: React.FC = () => {
  const [avatar, setAvatar] = useState('');
  const [color, setColor] = useState('#aabbcc');
  const [name, setName] = useState('Benjot');
  // const username: string = 'hello';
  const navigate = useNavigate();

  const requestData = {
    headers: {
      Authorization: `Bearer ${jwtParam}`,
    },
    params: {
      username: 'usertest',
    },
  };

  const handleEnableTwoFactor = (): void => {
    axios
      .post(`http://localhost:8080/api/auth/generate/`, requestData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Request Error: ', error);
      });
    navigate('/ConfirmTwoFactor');
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
          <Button size="large" variant="outlined" onClick={handleEnableTwoFactor}>
            Enable 2fa
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
