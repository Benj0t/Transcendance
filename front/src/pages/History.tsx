import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import ProfileButton from '../components/profileButton';

interface Row {
  id: number;
  opponentAvatar: string;
  opponentName: string;
  result: string;
  score: string;
  gameLength: string;
}

const columns = [
  { field: 'opponentAvatar', headerName: 'Opponent', width: 200 },
  { field: 'opponentName', headerName: 'Name', width: 200 },
  { field: 'result', headerName: 'Result', width: 200 },
  { field: 'score', headerName: 'Score', width: 200 },
  { field: 'gameLength', headerName: 'Durée', width: 200 },
];

const rows: Row[] = [
  {
    id: 1,
    opponentAvatar: 'M',
    opponentName: 'Michel',
    result: '🟢',
    score: '3-2',
    gameLength: '7m04s',
  },
  {
    id: 2,
    opponentAvatar: 'J',
    opponentName: 'Jean',
    result: '🔴',
    score: '0-3',
    gameLength: '1m27s',
  },
  {
    id: 3,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
  {
    id: 4,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
  {
    id: 5,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
  {
    id: 6,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
  {
    id: 7,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
  {
    id: 8,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
  {
    id: 9,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
  {
    id: 10,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
  {
    id: 11,
    opponentAvatar: 'S',
    opponentName: 'Sophie',
    result: '🟢',
    score: '3-0',
    gameLength: '5m34s',
  },
];

const History: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', width: '100%' }}
    >
      <Box
        id="avatar"
        style={{
          position: 'absolute',
          top: '2%',
          left: '95%',
        }}
      >
        <ProfileButton />
      </Box>
      <Box width="70%" height="70%">
        <h1 style={{ color: 'grey', textAlign: 'center' }}>HISTORIQUE</h1>
        <DataGrid density="standard" rows={rows} columns={columns} autoPageSize />
      </Box>
    </Box>
  );
};

export default History;
