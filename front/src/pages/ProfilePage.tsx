import React, { useEffect, useState } from 'react';
import { Avatar, Box, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import LoadingPage from './LoadingPage';
import { useWebSocket } from '../context/pongSocket';
import { type PacketReceived } from '../components/packet/in/PacketReceived';
import { notifyToasterInivtation } from '../components/utils/toaster';
import GetUserById from '../requests/getUserById';

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

const ProfilePage: React.FC = () => {
  const { userID } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { pongSocket, createSocket } = useWebSocket();
  const [user, setUser] = useState<getUserMeResponse>();
  useEffect(() => {
    if (userID === undefined) {
      setError(true);
      return;
    }
    if (pongSocket === null) {
      createSocket();
    }
    GetUserById(parseInt(userID))
      .then((req) => {
        if (req === undefined) setError(true);
        setUser(req);
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

  if (loading || error || user === undefined || userID === undefined) return <LoadingPage />;
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
      ></Box>
      <Box
        width="80%"
        height="80%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <IconButton size="large">
          <Avatar
            alt="Profile Picture"
            sx={{ width: '50vh', height: '50vh' }}
            src={`data:image/png;base64, ${user?.avatar_base64}`}
          />
        </IconButton>
        <h1 id="outlined-controlled">Nom: {user.nickname}</h1>
        <h1 style={{ color: 'grey' }}>ID: {user.id}</h1>
      </Box>
    </Box>
  );
};

export default ProfilePage;
