import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import joinChannel from '../requests/postJoinChannel';
import { notifyToasterError, notifyToasterInfo, notifyToasterSuccess } from './utils/toaster';

const ButtonJoinChannel: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [passEnable, setPassEnable] = React.useState<boolean>(false);

  const [name, setName] = React.useState('');
  const [pass, setPass] = React.useState('');

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
  };

  const handleSubmit = (): void => {
    joinChannel(name, passEnable ? pass : '')
      .then((req) => {
        if (req === 'ok') {
          notifyToasterSuccess(`Successfully joined channel ${name}`);
          window.location.reload();
        } else {
          notifyToasterInfo(req);
        }
      })
      .catch((err) => {
        console.log(err);
        notifyToasterError('Could not join desired channel');
      });
  };
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Rejoindre un channel
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Rejoindre un channel</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                type="number"
                label="ID du Channel"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value);
                }}
              ></TextField>
            </FormControl>
          </Box>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ButtonJoinChannel;
