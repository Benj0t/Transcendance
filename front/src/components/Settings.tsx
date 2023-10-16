import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

interface Setting {
  id: string;
  label: string;
  value: string;
}

interface SettingsPageProps {
  settings: Setting[];
}

const Settings: React.FC<SettingsPageProps> = ({ settings }) => {
  const [updatedSettings, setUpdatedSettings] = useState<Setting[]>(settings);

  const handleInputChange = (id: string, newValue: string): void => {
    const updatedSettingsCopy = [...updatedSettings];
    const settingToUpdate = updatedSettingsCopy.find((setting) => setting.id === id);
    if (settingToUpdate != null) {
      settingToUpdate.value = newValue;
      setUpdatedSettings(updatedSettingsCopy);
    }
  };

  const handleSaveChanges = (): void => {
    console.log('Updated Settings:', updatedSettings);
  };

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h5">Settings</Typography>
      <Grid container spacing={2}>
        {updatedSettings.map((setting) => (
          <Grid item xs={12} key={setting.id}>
            <Typography>{setting.label}</Typography>
            <TextField
              fullWidth
              value={setting.value}
              onChange={(e) => {
                handleInputChange(setting.id, e.target.value);
              }}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Settings;
