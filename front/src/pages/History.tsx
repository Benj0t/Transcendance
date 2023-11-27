import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext, useEffect, useState } from 'react';
import getUserMe from '../requests/getUserMe';
import getUserMatches from '../requests/getUserMatches';
import { UserContext } from '../context/userContext';
import LoadingPage from './LoadingPage';
// import GetUserById from '../requests/getUserById';

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

// const [rows, setRows] = useState<Row[]>([]);

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
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [addName, setAddName] = useState('');
  // const [rows, setRows] = useState<Row[]>([]);
  const me = useContext(UserContext).user;
  void userId;
  useEffect(() => {
    getUserMe()
      .then((req) => {
        setUserId(req.id);
      })
      .catch((err) => {
        setError(err);
      });
    async function fetchData(): Promise<any> {
      try {
        const req = await getUserMatches(me.id);
        const matches = req;
        console.log(req);
        const keys = Object.keys(matches);
        const size = keys.length;
        for (let i = 0; i < size; i++) {
          // const gameid = i;
          // let opponent;
          // let result;
          // if (me.id === matches[i].winner_id)
          //   result = '🟢';
          // else
          //   result = '🔴';
          // if (matches[i].user_id === me.id)
          //   opponent = await GetUserById(matches[i].user_id);
          // else
          //   opponent = await GetUserById(matches[i].opponent_id);
          // const opponentAvatar = opponent.avatar_base64;
          // const opponentName = opponent.nickname;
          // const addScore = ??????S
          // const addGameLength = ???????
          // const addrow = { id: gameid, avatar: opponentAvatar, name: opponentName, status: result, score: addScore, gameLenght: addGameLenght };
          // setRows((prevRows) => [...prevRows, addrow]);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
          setError(err.message);
        }
      }
    }
    setLoading(false);
    const test = fetchData();
    void test;
  }, []);
  // if (error !== '') return <h1>Something bad happened: {error}</h1>;
  if (loading) return <LoadingPage />;
  console.log(error);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', width: '100%' }}
    >
      <Box width="70%" height="70%">
        <h1 style={{ color: 'grey', textAlign: 'center' }}>HISTORIQUE</h1>
        <DataGrid density="standard" rows={rows} columns={columns} autoPageSize />
      </Box>
    </Box>
  );
};

export default History;
