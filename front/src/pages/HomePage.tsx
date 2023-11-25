import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import ProfileButton from '../components/profileButton';
import { getPongSocket } from '../components/pongSocket';
import { PacketInKeepAlive } from '../components/packet/in/PacketInKeepAlive';
import { UserContext } from '../context/userContext';

const HomePage: React.FC = () => {
  const me = useContext(UserContext).user;
  const keepInterval = setInterval(() => {
    pongSocket.emit('keep_alive_packet', new PacketInKeepAlive(me.yPcent));
  }, 50);
  void keepInterval;
  /**
   * States
   */
  const navigate = useNavigate();
  const pongSocket = getPongSocket();
  /**
   * Handlers
   */
  const handleGame = (): void => {
    navigate('/waiting-room');
  };
  const handleChat = (): void => {
    navigate('/chat');
  };
  useEffect(() => {
    pongSocket?.on('time_packet', (packetOutTime) => {});
  }, []);
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
