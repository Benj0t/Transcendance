import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import postChannelOp from '../requests/postChannelOp';
import { notifyToasterError, notifyToasterInfo } from './utils/toaster';

interface channelUsersResponse {
  channel_id: number;
  user_id: number;
  role: number;
  mute_expiry_at?: Date;
}

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

interface AdminPanelProps {
  channelUsers: channelUsersResponse[];
  me: getUserMeResponse;
  users: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ channelUsers, me, users }) => {
  const [open, setOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState('');

  const amIAdmin = (): boolean => {
    const size = channelUsers.length;
    for (let i = 0; i < size; i++) {
      if (channelUsers[i].user_id === me.id && channelUsers[i].role < 2) {
        return true;
      }
    }
    return false;
  };

  const handleSubmitNewAdmin = (): void => {
    const user = users.find((el: { nickname: string }) => el.nickname === newAdmin);
    if (user === undefined) {
      notifyToasterError('Can not find this user');
      return;
    }
    postChannelOp(channelUsers[0].channel_id, me.id, user.id)
      .then((req) => {
        notifyToasterInfo(req);
      })
      .catch((err) => {
        console.log(err);
        notifyToasterError('Could not add this user as channel Administrator');
      });
  };
  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string): void => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  if (!amIAdmin()) return <></>;
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        ADMIN PANNEL
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Administrator Panel</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="Nouvel Administrateur"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewAdmin(event.target.value);
                }}
              ></TextField>
              <Button onClick={handleSubmitNewAdmin}> OK </Button>
            </FormControl>
          </Box>
          <FormControl sx={{ m: 1 }}>
            <TextField label="Mot de Passe"></TextField>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
