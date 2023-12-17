import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext, useEffect, useState } from 'react';
import getUserMe from '../requests/getUserMe';
import getUserMatches from '../requests/getUserMatches';
import { UserContext } from '../context/userContext';
import LoadingPage from './LoadingPage';
import GetUserById from '../requests/getUserById';
import { useWebSocket } from '../context/pongSocket';
import { type PacketReceived } from '../components/packet/in/PacketReceived';
import { notifyToasterInivtation } from '../components/utils/toaster';
import { useNavigate } from 'react-router';
import ProfileButton from '../components/profileButton';

interface Row {
  id: number;
  name: any;
  result: string;
  score: string;
  gameLength: string;
}

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'result', headerName: 'Result', width: 200 },
  { field: 'score', headerName: 'Score', width: 200 },
  { field: 'gameLength', headerName: 'Durée', width: 200 },
];

const History: React.FC = () => {
  const [error, setError] = useState(false);
  const [user, setUser] = useState<getUserMeResponse>();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [played, setPlayed] = useState(0);
  const [winrate, setWinrate] = useState(0);
  const [grade, setGrade] = useState('😄');
  const me = useContext(UserContext).user;
  const { pongSocket, createSocket } = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }
    const handleReceived = (param1: PacketReceived): void => {
      notifyToasterInivtation(`Invited to a game !`, param1.opponentId, acceptGame);
    };

    pongSocket?.on('invite_received', handleReceived);

    return () => {
      pongSocket?.off('invite_received', handleReceived);
    };
  }, []);

  const acceptGame = (arg: number): void => {
    navigate(`/game?param=${arg}`);
  };

  // useEffect(() => {
  //   const handleReceived = (param1: PacketReceived): void => {
  //     notifyToasterInivtation(`Invited to a game !`, param1.opponentId, acceptGame);
  //   };

  //   pongSocket?.on('invite_received', handleReceived);

  //   return () => {
  //     pongSocket?.off('invite_received', handleReceived);
  //   };
  // }, []);

  useEffect(() => {
    getUserMe()
      .then((req) => {
        setUser(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });

    async function fetchData(): Promise<any> {
      try {
        const req = await getUserMatches(me.id);
        const matches = req;
        const keys = Object.keys(matches);
        const size = keys.length;
        setPlayed(size);
        let won = 0;
        for (let i = 0; i < size; i++) {
          const gameid = i;
          const uscore1: number = matches[i].score_user_1;
          const uscore2: number = matches[i].score_user_2;
          const uduration: number = matches[i].match_duration;
          let opponent;
          let addresult;
          let addscore;
          if (me.id === matches[i].winner_id) {
            addresult = '🟢';
            addscore = `${uscore1}-${uscore2}`;
            won++;
          } else {
            addresult = '🔴';
            addscore = `${uscore2}-${uscore1}`;
          }
          if (matches[i].user_id !== me.id) opponent = await GetUserById(matches[i].user_id);
          else opponent = await GetUserById(matches[i].opponent_id);
          const opponentName = opponent.nickname;
          const addGameLength = `${uduration}s`;
          const addrow = {
            id: gameid,
            name: opponentName,
            result: addresult,
            score: addscore,
            gameLength: addGameLength,
          };
          setWinrate(Math.floor((won / size) * 100));
          if ((won / size) * 100 >= 50) setGrade('😄');
          else setGrade('😔');
          setRows((prevRows) => [...prevRows, addrow]);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
          setError(true);
        }
      }
    }
    setLoading(false);
    const test = fetchData();
    void test;
  }, []);
  if (error || user === undefined) return <h1>Something bad happened</h1>;
  if (loading) return <LoadingPage />;
  console.log(error);

  return (
    <>
      <Box width="5" height="5%">
        <h1 style={{ color: 'grey', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ textAlign: 'left' }}>Game played: {played}</span>
          <span style={{ textAlign: 'center' }}>Winrate: {winrate}%</span>
          <span style={{ textAlign: 'right' }}>{grade}</span>
        </h1>
      </Box>
      <Box
        id="avatar"
        style={{
          position: 'absolute',
          top: '2%',
          left: '95%',
        }}
      >
        <ProfileButton user={user} />
      </Box>
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
    </>
  );
};

export default History;
