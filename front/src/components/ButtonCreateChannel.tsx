import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import CreateChannel from '../requests/postCreateChannel';
import LoadingPage from '../pages/LoadingPage';
import getUserFriends, { type getUserFriendsRequest } from '../requests/getUserFriends';
import GetUserById from '../requests/getUserById';
import { notifyToasterError, notifyToasterInfo, notifyToasterSuccess } from './utils/toaster';

const ButtonCreateChannel: React.FC<{ me: number }> = ({ me }) => {
  const [open, setOpen] = useState(false);
  const [passEnable, setPassEnable] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [member, setMember] = useState<number[]>([]);

  const [friendsId, setFriendsId] = useState<getUserFriendsRequest[]>([]);
  const [friendsName, setFriendsName] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleChange = (event: SelectChangeEvent<typeof member>): void => {
    const options = event.target.value as number[];
    const value: number[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      console.log('New member: ', options[i]);
      value.push(options[i]);
    }
    setMember(value);
  };

  const handleEnablePass = (): void => {
    setPassEnable((prevState) => {
      return !prevState;
    });
  };

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string): void => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
    setMember([]);
  };
  const getMembersId = (): number[] => {
    const data = [];
    const size = member.length;
    for (let i = 0; i < size; i++) {
      if (friendsId[member[i]].friend_id !== me) data.push(friendsId[member[i]].friend_id);
    }
    data.unshift(me);
    return data;
  };

  const handleSubmit = (): void => {
    if (member.find((element) => element === me) === null) member.unshift(me);
    CreateChannel(name, passEnable ? pass : '', getMembersId())
      .then((req) => {
        if (req === 'ok') {
          notifyToasterSuccess('Channel created');
          setOpen(false);
          setMember([]);
          window.location.reload();
        } else {
          notifyToasterInfo(req);
        }
      })
      .catch((err) => {
        notifyToasterError(err);
      });
  };
  useEffect(() => {
    getUserFriends()
      .then((req) => {
        setFriendsId(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    const size = Object.keys(friendsId).length;
    for (let i = 0; i < size; i++) {
      GetUserById(friendsId[i].friend_id)
        .then((req) => {
          setFriendsName((prevName) => [...prevName, req.nickname]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setLoading(false);
  }, [friendsId]);
  if (me === 0) return <></>;
  if (error) return <p>Error: could not resolve data</p>;
  if (loading) return <LoadingPage />;
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Créer un channel
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Créer un channel</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Nom du channel"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value);
                }}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="ChannelInvite">Membres</InputLabel>
              <Select
                multiple
                labelId="ChannelInvite"
                label="ChannelInvite"
                id="demo-dialog-select"
                value={member}
                onChange={handleChange}
                input={<OutlinedInput label="Invite" />}
              >
                {friendsName.map((msg, index) => (
                  <MenuItem key={index} value={index}>
                    {msg}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1 }}>
              <FormControlLabel
                control={<Checkbox checked={passEnable} onChange={handleEnablePass} />}
                label="Channel privé"
              />
              <TextField
                disabled={!passEnable}
                label="Mot de Passe"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPass(event.target.value);
                }}
              ></TextField>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ButtonCreateChannel;
