import React, { useEffect, useState } from 'react';
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
  // notifyToasterError,
  notifyToasterInfo,
  notifyToasterSuccess,
} from '../components/utils/toaster';
import { useNavigate } from 'react-router';
import ProfileButton from '../components/profileButton';

interface Row {
  id: number;
  avatar: any;
  name: any;
  status: string;
}

const FriendList: React.FC = () => {
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addName, setAddName] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const columns = [
    { field: 'avatar', headerName: 'Avatar', width: 1200 / 5 },
    { field: 'name', headerName: 'Username', width: 1200 / 5 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'invite', // Colonne pour le bouton Invite To Play
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
      field: 'block', // Colonne pour le bouton bloquer joueur
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
    alert('User blocked');
  };

  const handleInviteClick = (friendId: number): any => {
    setSelectedFriendId(friendId);
    setOpenDialog(true);
  };

  const handleDialogClose = (confirmed: boolean): any => {
    setOpenDialog(false);
    if (confirmed && selectedFriendId != null) {
      navigate('/loadingPage');
    }
  };

  const handleKeyDownAdd = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      postAddFriend(parseInt(addName))
        .then((req) => {
          console.log(req);
          if (req.message === 'ok') notifyToasterSuccess('Votre ami à été ajouté avec succès !');
          else {
            notifyToasterInfo('Vous êtes déjà ami avec cet utilisateur!');
          }
        })
        .catch((err) => {
          console.log(err);
          // notifyToasterError(`Impossible d'ajouter l'identifiant: ${addName}`);
          alert('AAA');
        });
      setAddName('');
    }
  };

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
        const req = await getUserFriends();
        const friends = req;
        console.log(req);
        const keys = Object.keys(friends);
        const size = keys.length;
        for (let i = 0; i < size; i++) {
          const friendid = friends[i].friend_id;
          const addfriend = await GetUserById(friendid);
          const addid = 14 + i;
          const addavatar = addfriend.avatar_base64;
          const addname = addfriend.nickname;
          const addrow = { id: addid, avatar: addavatar, name: addname, status: '🟩' };
          // Change status with socket idk how
          setRows((prevRows) => [...prevRows, addrow]);
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
        <h1 style={{ color: 'grey' }}>Your userID: {userId}</h1>
        <TextField
          label="Ajouter Ami (ID)"
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
        <ProfileButton />
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
