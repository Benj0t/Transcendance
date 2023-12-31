import { Logout, Settings } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import { delete_cookie } from 'sfcookies';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ChatIcon from '@mui/icons-material/Chat';

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}
interface ProfileButtonProps {
  user: getUserMeResponse;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };
  const onClickHome = (): void => {
    navigate('/');
  };
  const onClickGame = (): void => {
    navigate('/game');
  };
  const onClickChat = (): void => {
    navigate('/chat');
  };
  const onClickFriends = (): void => {
    navigate('/friends');
  };
  const onClickHistory = (): void => {
    navigate('/history');
  };
  const onClickSettings = (): void => {
    navigate('/settings');
  };
  const onClickDisconnect = (): void => {
    delete_cookie('jwt');
    navigate('/login');
  };
  return (
    <div>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="large"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: '5vh', height: '5vh' }}
            src={`data:image/png;base64, ${user?.avatar_base64}`}
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onClickHome}>
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          Home
        </MenuItem>
        <MenuItem onClick={onClickGame}>
          <ListItemIcon>
            <SportsTennisIcon fontSize="small" />
          </ListItemIcon>
          Game
        </MenuItem>
        <MenuItem onClick={onClickChat}>
          <ListItemIcon>
            <ChatIcon fontSize="small" />
          </ListItemIcon>
          Chat
        </MenuItem>
        <MenuItem onClick={onClickFriends}>
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          Amis
        </MenuItem>
        <MenuItem onClick={onClickHistory}>
          <ListItemIcon>
            <CalendarMonthIcon fontSize="small" />
          </ListItemIcon>
          Historique
        </MenuItem>
        <Divider />
        <MenuItem onClick={onClickSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Paramètres
        </MenuItem>
        <MenuItem onClick={onClickDisconnect}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Déconnexion
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileButton;
