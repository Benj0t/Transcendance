import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

interface MemberListProps {
  channel: number;
  channelsMembers: Array<{
    id: number;
    names: string[];
  }>;
}

const MemberList: React.FC<MemberListProps> = ({ channelsMembers, channel }) => {
  const handleItemClick = (value: number): void => {
    console.log(channelsMembers.find((item) => item.id === value));
  };

  const currMembers = channelsMembers.find((item) => item.id === channel)?.names;
  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {// if (currMembers)
      currMembers?.map((value, index) => {
        // Set Friends ID instead of random numbers
        const labelId = `list-${index}`;
        return (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => {
                handleItemClick(index);
              }}
            >
              <ListItemAvatar>
                <Avatar src={`/static/images/avatar/${index + 1}.jpg`}>T</Avatar>
              </ListItemAvatar>
              <ListItemText id={labelId} primary={currMembers[index]} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default MemberList;
