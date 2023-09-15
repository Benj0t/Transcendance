import React from 'react';
import isUserAuth from '../components/htmlRoutes';
import { useNavigate } from 'react-router';
import { Box, Button, Grid } from '@mui/material';
import ProfileButton from '../components/profileButton';

const Homepage: React.FC = () => {
  /**
   * States
   */
  const navigate = useNavigate();
  if (!isUserAuth()) navigate('/auth');
  /**
   * Handlers
   */
  const onClickGame = (): void => {
    navigate('/game/waiting-room');
  };
  const onClickChat = (): void => {
    navigate('/chat');
  };
  return (
    <Box textAlign="right">
      <ProfileButton />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
      >
        <Button size="large" name="Game" variant="contained" onClick={onClickGame}>
          GAME
        </Button>
        <Button size="large" name="Chat" variant="contained" onClick={onClickChat}>
          CHAT
        </Button>
      </Grid>
    </Box>
  );
};

export default Homepage;
