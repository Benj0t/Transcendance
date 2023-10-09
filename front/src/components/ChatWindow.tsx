import React from 'react';
import { Box, Paper } from '@mui/material';

interface ChatWindowProps {
  messages: Array<{ text: string; sender: string }>;
  onSendMessage: (message: { text: string; sender: string }) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  return (
    <Paper
      style={{
        padding: '16px',
        overflowY: 'scroll',
        maxHeight: '70vh',
        width: '100%',
      }}
    >
      <Box>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'You' ? 'right' : 'left',
              marginBottom: '8px',
            }}
          >
            <strong style={{ color: msg.sender === 'You' ? 'blue' : 'red' }}>{msg.sender}: </strong>{' '}
            {msg.text}
          </div>
        ))}
      </Box>
    </Paper>
  );
};

export default ChatWindow;
