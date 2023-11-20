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

interface ButtonCreateChannelProps {
  friends: string[];
}

const ButtonCreateChannel: React.FC<ButtonCreateChannelProps> = ({ friends }) => {
  // export default function DialogSelect(): React.FC {
  const [open, setOpen] = React.useState(false);
  const [passEnable, setPassEnable] = React.useState<boolean>(true);
  const [member, setMember] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof member>): void => {
    const options = event.target.value as string[];
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
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
  };

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
              <TextField label="Nom du channel"></TextField>
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
                {friends.map((msg, index) => (
                  <MenuItem key={index} value={index}>
                    {msg}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1 }}>
              <FormControlLabel
                control={<Checkbox checked={!passEnable} onChange={handleEnablePass} />}
                label="Channel privé"
              />
              <TextField disabled={passEnable} label="Mot de Passe"></TextField>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ButtonCreateChannel;
