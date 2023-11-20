import { Button, TextField, Typography } from '@mui/material';
import React from 'react';

interface TwoFactorInputProps {
  twoFactorCode: string;
  setTwoFactorCode: React.Dispatch<React.SetStateAction<string>>;
  handleTwoFactor: () => void;
}

const TwoFactorInput: React.FC<TwoFactorInputProps> = ({
  twoFactorCode,
  setTwoFactorCode,
  handleTwoFactor,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTwoFactor();
    }
  };
  return (
    <>
      <TextField
        sx={{ width: 300 }}
        autoFocus
        variant="outlined"
        value={twoFactorCode}
        onChange={(e) => {
          setTwoFactorCode(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <Button
        name="code"
        variant="contained"
        onClick={handleTwoFactor}
        style={{ width: '35%', height: '8%', marginLeft: '1%' }}
      >
        <Typography fontSize="2vw">Confirm generated code</Typography>
      </Button>
    </>
  );
};

export default TwoFactorInput;
