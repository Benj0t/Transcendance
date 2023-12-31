import { Box, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';

interface ChatInputProps {
  handleSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ handleSendMessage }) => {
  const [message, setMessage] = useState<string>('');
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage(message);
      setMessage('');
    }
  };
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 25px',
        width: '100%',
      }}
    >
      <TextField
        fullWidth
        autoFocus
        variant="outlined"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <IconButton
        style={{ marginTop: '1%', height: '50px' }}
        onClick={() => {
          handleSendMessage(message);
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
