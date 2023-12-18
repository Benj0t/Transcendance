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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as React from 'react';
import { notifyToasterError, notifyToasterInfo, notifyToasterSuccess } from './utils/toaster';
import deleteChannel from '../requests/deleteChannel';

interface ButtonDeleteChannelProps {
  channelID: number;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonDeleteChannel: React.FC<ButtonDeleteChannelProps> = ({ channelID, setOpenForm }) => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleDelete = (): void => {
    deleteChannel(channelID)
      .then((req) => {
        if (req === 'ok.') notifyToasterSuccess('Channel delete');
        else {
          notifyToasterInfo(req);
        }
      })
      .catch((err) => {
        console.log(err);
        notifyToasterError('Could not delete channel');
      });
    setOpenForm(false);
    handleClose();
  };
  return (
    <Box>
      <Button variant="outlined" onClick={handleClickOpen}>
        <ListItemIcon>
          <DeleteOutlineIcon />
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
            Supprimer un channel est une action est irréversible !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleDelete} autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ButtonDeleteChannel;
