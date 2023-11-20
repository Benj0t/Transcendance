import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Typography } from '@mui/material';
import ProfileButton from '../components/profileButton';

const HomePage: React.FC = () => {
  /**
   * States
   */
  const navigate = useNavigate();
  /**
   * Handlers
   */
  const handleGame = (): void => {
    navigate('/waiting-room');
  };
  const handleChat = (): void => {
    navigate('/chat');
  };
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
