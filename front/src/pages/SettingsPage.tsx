import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { useNavigate } from 'react-router';
import AuthEnabled from '../requests/getAuthEnabled';
import AuthGenerate from '../requests/postAuthGenerate';
import LoadingPage from './LoadingPage';
import { useWebSocket } from '../context/pongSocket';
import { PacketInInvite } from '../components/packet/in/PacketInvite';
import { UserContext } from '../context/userContext';
import { type PacketReceived } from '../components/packet/in/PacketReceived';
import { notifyToasterInivtation } from '../components/utils/toaster';

const SettingsPage: React.FC = () => {
  const [avatar, setAvatar] = useState('');
  const [color, setColor] = useState('#aabbcc');
  const [name, setName] = useState('Benjot');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { pongSocket, createSocket } = useWebSocket();
  const me = useContext(UserContext).user;

  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }
  }, []);

  const acceptGame = (arg: number): void => {
    navigate(`/game?param=${arg}`);
  };

  useEffect(() => {
    const handleReceived = (param1: PacketReceived): void => {
      notifyToasterInivtation(`Invited to a game !`, param1.opponentId, acceptGame);
    };

    pongSocket?.on('invite_received', handleReceived);

    return () => {
      pongSocket?.off('invite_received', handleReceived);
    };
  }, []);

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
    const hello: number = 2;

    navigate(`/game?param=${hello}`);
    pongSocket?.emit('invite_packet', new PacketInInvite(2, me.id));
    // navigate('/AuthTwoFactor');
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
