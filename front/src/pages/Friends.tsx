import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
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
    const userid = 1;
    const jwt = Cookies.get('jwt');
    if (jwt === undefined) navigate('/login');
    const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
    const requestData = {
      headers: {
        Authorization: authHeader,
      },
    };
    axios
      .get(`http://localhost:8080/api/user/${userid}/friends/`, requestData) // replace 1 with correct user id
      .then((response) => {
        const ret = response.data;
        const keys = Object.keys(ret);
        const size = keys.length;
        for (let i = 0; i < size; i++) {
          const friendid: number = ret[i].friend_id;
          axios
            .get(`http://localhost:8080/api/user/${friendid}/`, requestData) // replace 1 with correct user id
            .then((response) => {
              const addid: number = 14 + i; // erase "14 +" when harcoded test will gtfo
              const addavatar: string = response.data.avatar_base64;
              const addname: string = response.data.nickname;
              const addfriend: Row = { id: addid, avatar: addavatar, name: addname, status: '🟩' };
              setRows((rows) => [...rows, addfriend]);
            })
            .catch((error) => {
              console.error('Request Error: ', error);
            });
        }
      })
      .catch((error) => {
        console.error('Request Error: ', error);
      });
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
