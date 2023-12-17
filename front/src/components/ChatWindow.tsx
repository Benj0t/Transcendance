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
  members: any[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, me, members }) => {
  const getUserName = (value: any): any => {
    const user = members.find((el: { id: number }) => el.id === value.user_id);
    return user.nickname;
  };
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
        {messages.map((value, index) => (
          <div
            key={index}
            style={{
              textAlign: value.user_id === me ? 'right' : 'left',
              marginBottom: '8px',
            }}
          >
            <strong style={{ color: value.user_id === me ? 'blue' : 'red' }}>
              {getUserName(value)}
            </strong>
            {value.message}
          </div>
        ))}
      </Box>
    </Paper>
  );
};

export default ChatWindow;
