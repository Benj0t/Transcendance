import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import ProfileButton from '../components/profileButton';
import { useWebSocket } from './../context/pongSocket';
import { notifyToasterInivtation } from '../components/utils/toaster';
import { type PacketReceived } from '../components/packet/in/PacketReceived';
import getUserMe from '../requests/getUserMe';
interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

const HomePage: React.FC = () => {
  /**
   * States
   */
  const navigate = useNavigate();
  const [user, setUser] = useState<getUserMeResponse>();
  const [error, setError] = useState(false);
  const { pongSocket, createSocket } = useWebSocket();

  const acceptGame = (arg: number): void => {
    navigate(`/game?param=${arg}`);
  };

  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }
    getUserMe()
      .then((req) => {
        setUser(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
    const handleReceived = (param1: PacketReceived): void => {
      notifyToasterInivtation(`Invited to a game !`, param1.opponentId, acceptGame);
    };

    pongSocket?.on('invite_received', handleReceived);

    return () => {
      pongSocket?.off('invite_received', handleReceived);
    };
  }, []);

  /**
   * Handlers
   */

  const handleGame = (): void => {
    navigate('/game');
  };
  const handleChat = (): void => {
    navigate('/chat');
  };
  if (user === undefined || error) return <></>;
  return (
    <Box textAlign="right" sx={{ height: '100%', width: '100%' }}>
      <ProfileButton user={user} />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: '10%', height: '50%', width: '100%' }}
      >
        <Box>
          <Button
            name="Game"
            variant="contained"
            onClick={handleGame}
            style={{ width: '48%', height: '30%', marginRight: '5%' }}
          >
            <Typography fontSize="8vw">GAME</Typography>
          </Button>
          <Button
            color="primary"
            name="Chat"
            variant="contained"
            onClick={handleChat}
            style={{ width: '47%', height: '30%' }}
          >
            <Typography fontSize="8vw">CHAT</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
