import React from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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

const rows: Row[] = [
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
];

const FriendList: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', width: '100%' }}
    >
      <Box width="80%" height="70%">
        <h1 style={{ color: 'grey', textAlign: 'center' }}>AMIS</h1>
        <DataGrid density="comfortable" rows={rows} columns={columns} autoPageSize />
      </Box>
    </Box>
  );
};

export default FriendList;
