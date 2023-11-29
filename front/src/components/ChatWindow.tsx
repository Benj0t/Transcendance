import React from 'react';
import { Box, Paper } from '@mui/material';
interface channelMessagesResponse {
  channel_id: number;
  user_id: number;
  message: string;
  created_at: Date;
}
interface ChatWindowProps {
  me: number;
  messages: channelMessagesResponse[];
  onSendMessage: (message: { text: string; sender: string }) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, me }) => {
  return (
    <Paper
      style={{
        padding: '16px',
        overflowY: 'scroll',
        height: '70vh',
        maxHeight: '70vh',
        width: '100%',
      }}
    >
      <Box>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.user_id === me ? 'right' : 'left',
              marginBottom: '8px',
            }}
          >
            <strong style={{ color: msg.user_id === me ? 'blue' : 'red' }}>{msg.user_id}: </strong>{' '}
            {msg.message}
          </div>
        ))}
      </Box>
    </Paper>
  );
};

export default ChatWindow;
