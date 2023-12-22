import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import { useNavigate } from 'react-router';
import AuthEnabled from '../requests/getAuthEnabled';
import AuthGenerate from '../requests/postAuthGenerate';
import LoadingPage from './LoadingPage';
import { useWebSocket } from '../context/pongSocket';
import { type PacketReceived } from '../components/packet/in/PacketReceived';
import {
  notifyToasterError,
  notifyToasterInfo,
  notifyToasterInivtation,
  notifyToasterSuccess,
} from '../components/utils/toaster';
import ProfileButton from '../components/profileButton';
import getUserMe from '../requests/getUserMe';
import patchUserName from '../requests/patchUserName';

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

const SettingsPage: React.FC = () => {
  const [name, setName] = useState<string>();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { pongSocket, createSocket } = useWebSocket();
  const [user, setUser] = useState<getUserMeResponse>();
  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }
    getUserMe()
      .then((req) => {
        if (req === undefined) setError(true);
        setUser(req);
        setName(req.nickname);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
    setLoading(false);
    const handleReceived = (param1: PacketReceived): void => {
      notifyToasterInivtation(`Invited to a game !`, param1.opponentId, acceptGame);
    };

    pongSocket?.on('invite_received', handleReceived);

    return () => {
      pongSocket?.off('invite_received', handleReceived);
    };
  }, []);

  const acceptGame = (arg: number): void => {
    navigate(`/game?param=${arg}`);
  };

  // useEffect(() => {
  //   const handleReceived = (param1: PacketReceived): void => {
  //     notifyToasterInivtation(`Invited to a game !`, param1.opponentId, acceptGame);
  //   };

  //   pongSocket?.on('invite_received', handleReceived);

  //   return () => {
  //     pongSocket?.off('invite_received', handleReceived);
  //   };
  // }, []);

  const handleEnableTwoFactor = async (): Promise<void> => {
    try {
      const qrcode = await AuthGenerate();
      if (qrcode !== '') navigate(`/ConfirmTwoFactor?param=${qrcode}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickAvatar = (): void => {
    notifyToasterInfo('This is your profile picture, later you will be able to change it :D !');
  };

  const handleClickSave = (): void => {
    if (name !== undefined)
      patchUserName(name)
        .then((_req) => {
          notifyToasterSuccess('Name successfully updated');
        })
        .catch((err) => {
          console.log(err);
          notifyToasterError('Could not update your name');
        });
  };

  useEffect(() => {
    AuthEnabled(null)
      .then((req) => {
        setTwoFactorEnabled(req);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading || error || user === undefined) return <LoadingPage />;
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
        <ProfileButton user={user} />
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
          <Avatar
            alt="Profile Picture"
            sx={{ width: '50vh', height: '50vh' }}
            src={`data:image/png;base64, ${user?.avatar_base64}`}
          />
        </IconButton>
        <TextField
          id="outlined-controlled"
          label="Nom d'utilisateur"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
        />
        <Box marginTop="1%">
          <Button size="large" variant="outlined" onClick={handleClickSave}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
