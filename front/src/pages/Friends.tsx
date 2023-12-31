import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import getUserFriends from '../requests/getUserFriends';
import GetUserById from '../requests/getUserById';
import getUserMe from '../requests/getUserMe';
import LoadingPage from './LoadingPage';
import postAddFriend from '../requests/postAddFriend';
import {
  notifyToasterError,
  notifyToasterInfo,
  notifyToasterInivtation,
  notifyToasterSuccess,
} from '../components/utils/toaster';
import { useNavigate } from 'react-router';
import { useWebSocket } from '../context/pongSocket';
import { type PacketReceived } from '../components/packet/in/PacketReceived';
import ProfileButton from '../components/profileButton';
import { PacketInInvite } from '../components/packet/in/PacketInvite';
import { UserContext } from '../context/userContext';
import blockUser from '../requests/postBlockUser';
import getUser from '../requests/getUser';

interface Row {
  id: number;
  avatar: string;
  name: any;
  status: string;
}

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

const FriendList: React.FC = () => {
  const [error, setError] = useState(false);
  const [newFriend, setNewFriend] = useState(0);
  const [user, setUser] = useState<getUserMeResponse>();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any>();
  const [addName, setAddName] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const { pongSocket, createSocket } = useWebSocket();
  const navigate = useNavigate();
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const me = useContext(UserContext).user;
  const columns = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 120,
      renderCell: (params: { row: Row }): React.ReactNode => (
        <img
          src={`data:image/png;base64, ${params.row.avatar}`}
          alt="Avatar"
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      ),
    },
    { field: 'name', headerName: 'Username', width: 1200 / 5 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'invite',
      headerName: 'Invite To Play',
      width: 1200 / 5,
      renderCell: (params: { row: { id: number } }): any => (
        <Button
          variant="outlined"
          style={{ width: '200px' }}
          onClick={() => handleInviteClick(params.row.id)}
        >
          Invite Friend
        </Button>
      ),
    },
    {
      field: 'block',
      headerName: 'Block Player',
      width: 1200 / 5,
      renderCell: (params: { row: { id: number } }): any => (
        <Button
          variant="outlined"
          style={{ color: 'white', backgroundColor: 'red', width: '200px' }}
          onClick={() => handleBlockButton(params.row.id)}
        >
          Block User
        </Button>
      ),
    },
  ];

  const handleBlockButton = (BlockId: number): any => {
    blockUser(BlockId)
      .then((_req) => {
        notifyToasterSuccess('User successfully blocked');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInviteClick = (friendId: number): any => {
    setSelectedFriendId(friendId);
    if (friendId !== null) {
      navigate(`/game?param=${friendId}`);
      pongSocket?.emit('invite_packet', new PacketInInvite(friendId, me.id));
    }
  };

  const handleDialogClose = (confirmed: boolean): any => {
    setOpenDialog(false);
    if (confirmed && selectedFriendId != null) {
      navigate('/loadingPage');
    }
  };

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

  const getNameByID = (name: string): number => {
    const user = users.find((el: { nickname: string }) => el.nickname === name);
    if (user !== undefined) return user.id;
    return 0;
  };

  const handleKeyDownAdd = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const name = getNameByID(addName);
      postAddFriend(name)
        .then((req) => {
          if (req.message.add_user_friend === 'ok') {
            notifyToasterSuccess('Votre ami à été ajouté avec succès !');
            setNewFriend((prevstate) => prevstate + 1);
            window.location.reload();
          } else if (req.message === 'This user does not exist') {
            notifyToasterError(`Aucun utilisateur ne correspond à cet identifiant: ${addName}`);
          } else {
            notifyToasterInfo('Vous êtes déjà ami avec cet utilisateur!');
          }
        })
        .catch((err) => {
          console.log(err);
          notifyToasterError(`Impossible d'ajouter l'identifiant: ${addName}`);
        });
      setAddName('');
    }
  };

  const getStatus = (userId: number, setStatus: (status: string) => void): void => {
    const handleConnected = (data: boolean): void => {
      pongSocket?.off('connected_by_user_id', handleConnected);
      if (data === null) setStatus('🟥');
      else {
        if (data ?? false) setStatus('🟧');
        else setStatus('🟩');
      }
    };
    if (pongSocket === null) setStatus('🟩');
    else {
      pongSocket?.emit('get_connected_by_user_id', userId);
      pongSocket.on('connected_by_user_id', handleConnected);
    }
  };

  useEffect(() => {
    setRows([]);
    getUserMe()
      .then((req) => {
        setUser(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
    getUser()
      .then((req) => {
        setUsers(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
    async function fetchData(): Promise<any> {
      try {
        if (pongSocket !== null) {
          const req = await getUserFriends();
          const friends = req;
          const keys = Object.keys(friends);
          const size = keys.length;
          for (let i = 0; i < size; i++) {
            let friendid = 0;
            if (me.id === friends[i].user_id) friendid = friends[i].friend_id;
            else friendid = friends[i].user_id;
            const addfriend = await GetUserById(friendid);
            const addavatar = addfriend.avatar_base64;
            const addname = addfriend.nickname;
            getStatus(friendid, (addstatus) => {
              const addrow = { id: friendid, avatar: addavatar, name: addname, status: addstatus };
              setRows((prevRows) => [...prevRows, addrow]);
            });
          }
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
  }, [newFriend, pongSocket]);
  if (loading || error || user === undefined) return <LoadingPage />;
  return (
    <Box
      display="grid"
      justifyContent="center"
      alignItems="center"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        height: '100%',
        width: '100%',
      }}
    >
      <Box style={{ margin: 'auto', textAlign: 'center' }}>
        <h2 style={{ color: 'grey' }}>Your userID: {user.id}</h2>
        <TextField
          label="Ajouter Ami"
          variant="outlined"
          value={addName}
          onChange={(e) => {
            setAddName(e.target.value);
          }}
          onKeyDown={handleKeyDownAdd}
        />
      </Box>
      <Box width="75%" height="70%">
        <h1 style={{ color: 'grey', textAlign: 'center' }}>AMIS</h1>
        <DataGrid density="comfortable" rows={rows} columns={columns} autoPageSize />
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
      <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Non
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FriendList;
