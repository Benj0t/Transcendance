import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import LoadingPage from '../pages/LoadingPage';
import GetUserById from '../requests/getUserById';

interface channelUsersResponse {
  channel_id: number;
  user_id: number;
  role: number;
  mute_expiry_at?: Date;
}
interface MemberListProps {
  channelMembers: channelUsersResponse[];
}

const MemberList: React.FC<MemberListProps> = ({ channelMembers }) => {
  const [members, setMembers] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const size = channelMembers.length;
    const datas: any[][] = [];
    for (let i = 0; i < size; i++) {
      GetUserById(channelMembers[i].channel_id)
        .then((req) => {
          datas.push([req.id, req.nickname]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setMembers(datas);
    setLoading(false);
  }, [channelMembers]);

  const handleItemClick = (value: number): void => {
    console.log(channelMembers.find((item) => item.user_id === value));
  };

  if (loading) return <LoadingPage />;
  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {members.map((_value: any, index: number) => {
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
              <ListItemText id={labelId} primary={members[index]} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default MemberList;
