import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Grid, Typography } from '@mui/material';
import ProfileButton from '../components/profileButton';

const HomePage: React.FC = () => {
  /**
   * States
   */
  const navigate = useNavigate();
  /**
   * Handlers
   */
  const onClickGame = (): void => {
    navigate('/waiting-room');
  };
  const onClickChat = (): void => {
    navigate('/chat');
  };
  return (
    <Box textAlign="right">
      <ProfileButton />
      <Grid
        container
        direction="row"
        padding="10px 300px"
        alignItems="center"
        spacing={0}
        justifyContent="space-between"
        sx={{ minHeight: '90vh' }}
      >
        <Button
          name="Game"
          variant="contained"
          onClick={onClickGame}
          style={{ width: 500, height: 300 }}
        >
          <Typography variant="h1">GAME</Typography>
        </Button>
        <Button
          color="primary"
          name="Chat"
          variant="contained"
          onClick={onClickChat}
          style={{ width: 500, height: 300 }}
        >
          <Typography variant="h1">CHAT</Typography>
        </Button>
      </Grid>
    </Box>
  );
};

export default HomePage;
