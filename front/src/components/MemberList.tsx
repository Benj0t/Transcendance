import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ChatIcon from '@mui/icons-material/Chat';
import Avatar from '@mui/material/Avatar';
import { useContext, useEffect, useState } from 'react';
import { Box, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router';
import { useWebSocket } from '../context/pongSocket';
import { PacketInInvite } from './packet/in/PacketInvite';
import { UserContext } from '../context/userContext';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import postDM from '../requests/postDM';

interface channelUsersResponse {
  channel_id: number;
  user_id: number;
  role: number;
  mute_expiry_at?: Date;
}
interface MemberListProps {
  users: any;
  channelMembers: channelUsersResponse[];
}

const MemberList: React.FC<MemberListProps> = ({ channelMembers, users }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pickUser, setPickUser] = useState<number>();
  const { pongSocket, createSocket } = useWebSocket();
  const me = useContext(UserContext).user;
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }
  }, []);

  const handleItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: channelUsersResponse,
  ): void => {
    setAnchorEl(event.currentTarget);
    const user = users?.find((item: { id: number }) => item.id === value.user_id);
    setPickUser(user?.id);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleProfile = (value: channelUsersResponse): void => {
    if (pickUser !== undefined) {
      console.log('navigate to : /profile/', pickUser);
      navigate(`/profile/${pickUser}`);
      handleClose();
    }
  };

  const handleChallenge = (value: channelUsersResponse): void => {
    if (pickUser !== undefined) {
      navigate(`/game?param=${pickUser}`);
      pongSocket?.emit('invite_packet', new PacketInInvite(pickUser, me.id));
      handleClose();
    }
  };

  const handleDM = (value: channelUsersResponse): void => {
    if (pickUser !== undefined) {
      postDM(pickUser, '')
        .then((req) => {
          console.log(req);
        })
        .catch((err) => {
          console.log(err);
        });
      handleClose();
    }
  };

  const getUserName = (value: channelUsersResponse): string => {
    const user = users?.find((el: { id: number }) => el.id === value.user_id);
    return user?.nickname;
  };

  const getUserAvatar = (value: channelUsersResponse): string => {
    const user = users?.find((el: { id: number }) => el.id === value.user_id);
    return user?.avatar_base64;
  };

  return (
    <Box>
      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {channelMembers.map((value, index: number) => {
          const labelId = `list-${index}`;
          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={(event) => {
                  handleItemClick(event, value);
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Profile Picture"
                    src={`data:image/png;base64, ${getUserAvatar(value)}`}
                  />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={getUserName(value)} />
              </ListItemButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleProfile(value);
                  }}
                >
                  <PersonSearchIcon />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleChallenge(value);
                  }}
                >
                  <SportsEsportsIcon />
                  Challenge
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleDM(value);
                  }}
                >
                  <ChatIcon />
                  Direct Message
                </MenuItem>
              </Menu>
            </ListItem>
          );
        })}
      </List>
      <h2 style={{ color: 'grey' }}>ID du Channel: {channelMembers[0]?.channel_id}</h2>
    </Box>
  );
};

export default MemberList;
