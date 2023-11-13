import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import GetUserFriends from '../requests/getUserFriends';
import GetUserById from '../requests/getUserById';

interface Row {
  id: number;
  avatar: string;
  name: string;
  status: string;
}

const columns = [
  { field: 'avatar', headerName: 'Avatar', width: 400 },
  { field: 'name', headerName: 'Username', width: 400 },
  { field: 'status', headerName: 'Status', width: 400 },
];

const FriendList: React.FC = () => {
  const [rows, setRows] = useState([
    { id: 1, avatar: 'J', name: 'John', status: '🟩' },
    { id: 2, avatar: 'M', name: 'Michel', status: '🟥' },
    { id: 3, avatar: 'J', name: 'John', status: '🟩' },
    { id: 4, avatar: 'J', name: 'John', status: '🟩' },
    { id: 5, avatar: 'J', name: 'John', status: '🟩' },
    { id: 6, avatar: 'J', name: 'John', status: '🟩' },
    { id: 7, avatar: 'J', name: 'John', status: '🟩' },
    { id: 8, avatar: 'J', name: 'John', status: '🟩' },
    { id: 9, avatar: 'J', name: 'John', status: '🟩' },
    { id: 10, avatar: 'J', name: 'John', status: '🟩' },
    { id: 11, avatar: 'J', name: 'John', status: '🟩' },
    { id: 12, avatar: 'J', name: 'John', status: '🟩' },
    { id: 13, avatar: 'J', name: 'John', status: '🟩' },
  ]);

  useEffect(() => {
    async function fetchData(): Promise<any> {
      try {
        const req = await GetUserFriends();
        const friends = req.data;
        const keys = Object.keys(friends);
        const size = keys.length;
        for (let i = 0; i < size; i++) {
          try {
            const friendid: number = friends[i].friend_id;
            const addfriend = await GetUserById(friendid);
            const addid: number = 14 + i; // erase "14 +" when harcoded test will gtfo
            const addavatar: string = addfriend.data.avatar_base64;
            const addname: string = addfriend.data.nickname;
            const addrow: Row = { id: addid, avatar: addavatar, name: addname, status: '🟩' };
            setRows((rows) => [...rows, addrow]);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    const test = fetchData();
    void test;
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', width: '100%' }}
    >
      <Box width="75%" height="70%">
        <h1 style={{ color: 'grey', textAlign: 'center' }}>AMIS</h1>
        <DataGrid density="comfortable" rows={rows} columns={columns} autoPageSize />
      </Box>
    </Box>
  );
};

export default FriendList;
