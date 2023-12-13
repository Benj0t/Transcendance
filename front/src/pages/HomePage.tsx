import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import ProfileButton from '../components/profileButton';
// import { getPongSocket } from '../context/pongSocket';
import { useWebSocket } from './../context/pongSocket';
import { notifyToasterInivtation } from '../components/utils/toaster';
import { type PacketReceived } from '../components/packet/in/PacketReceived';
import getUserMe from '../requests/getUserMe';
// import { PacketInKeepAlive } from '../components/packet/in/PacketInKeepAlive';
// import { UserContext } from '../context/userContext';
// import { PacketInHandshake } from '../components/packet/in/PacketInHandshake';
// import GetUserMe from '../requests/getUserMe';

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

const HomePage: React.FC = () => {
  // const me = useContext(UserContext).user;
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
    const handleReceived = (param1: PacketReceived): void => {
      notifyToasterInivtation(`Invited to a game !`, param1.opponentId, acceptGame);
    };

    pongSocket?.on('invite_received', handleReceived);

    getUserMe()
      .then((req) => {
        setUser(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
    return () => {
      pongSocket?.off('invite_received', handleReceived);
    };
  }, []);

  /**
   * Handlers
   */

  // useEffect(() => {
  //   GetUserMe()
  //     .then((reqdata) => {
  //       me.id = Math.ceil(Math.random() * 10); // replace with redata.data.id /!\
  //       if (pongSocket !== null) pongSocket.emit('handshake_packet', new PacketInHandshake(me.id));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       // return error page
  //     });
  // }, []);

  const handleGame = (): void => {
    navigate('/game');
  };
  const handleChat = (): void => {
    navigate('/chat');
  };
  // useEffect(() => {
  //   pongSocket?.on('time_packet', (packetOutTime) => {});
  // }, []);
  if (error) return <p>Something bad happened</p>;
  if (user === undefined) return <></>;
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
