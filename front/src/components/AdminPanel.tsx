import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material';
import React from 'react';

interface AdminPanelProps {
  isAdmin: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin }) => {
  if (!isAdmin) return <h1>JE SUIS PAS ADMIN</h1>;
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
        ADMIN PANNEL
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Administrator Panel</DialogTitle>
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

export default AdminPanel;
