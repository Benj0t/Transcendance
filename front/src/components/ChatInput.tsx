import { Box, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, handleSendMessage }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <Box style={{ display: 'grid', gridTemplateColumns: '1fr 25px', width: '100%' }}>
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
      <IconButton style={{ marginTop: '1%' }} onClick={handleSendMessage}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
