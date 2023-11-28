import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import ProfileButton from '../components/profileButton';
// import { getPongSocket } from '../context/pongSocket';
import { useWebSocket } from './../context/pongSocket';
// import { PacketInKeepAlive } from '../components/packet/in/PacketInKeepAlive';
// import { UserContext } from '../context/userContext';
// import { PacketInHandshake } from '../components/packet/in/PacketInHandshake';
// import GetUserMe from '../requests/getUserMe';

const HomePage: React.FC = () => {
  // const me = useContext(UserContext).user;
  /**
   * States
   */
  const navigate = useNavigate();
  const { pongSocket, createSocket } = useWebSocket();

  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }
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
  return (
    <Box textAlign="right" sx={{ height: '100%', width: '100%' }}>
      <ProfileButton />
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
