import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import * as React from 'react';
import { notifyToasterError, notifyToasterInfo, notifyToasterSuccess } from './utils/toaster';
import postLeaveChannel from '../requests/postLeaveChannel';

interface ButtonLeaveChannelProps {
  channelID: number;
}

const ButtonLeaveChannel: React.FC<ButtonLeaveChannelProps> = ({ channelID }) => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLeave = (): void => {
    postLeaveChannel(channelID)
      .then((req) => {
        if (req === 'ok') notifyToasterSuccess('Channel left');
        else {
          notifyToasterInfo(req);
        }
      })
      .catch((err) => {
        console.log(err);
        notifyToasterError('Could not leave channel');
      });
    handleClose();
  };
  return (
    <Box>
      <Button variant="outlined" onClick={handleClickOpen}>
        Leave Channel
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Êtes-vous sûr ?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Cette action ne vous empêchera pas de rejoindre à nouveau le channel
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Rester</Button>
          <Button onClick={handleLeave} autoFocus>
            Quitter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ButtonLeaveChannel;
