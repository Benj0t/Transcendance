import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';

const ButtonJoinChannel: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [passEnable, setPassEnable] = React.useState<boolean>(true);

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
              <TextField label="Nom du channel"></TextField>
            </FormControl>
          </Box>
          <FormControl sx={{ m: 1 }}>
            <FormControlLabel
              control={<Checkbox checked={!passEnable} onChange={handleEnablePass} />}
              label="Channel privé"
            />
            <TextField disabled={passEnable} label="Mot de Passe"></TextField>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ButtonJoinChannel;
