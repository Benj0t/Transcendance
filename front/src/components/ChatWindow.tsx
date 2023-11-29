import React from 'react';
import { Box, Paper } from '@mui/material';
// import GetUserById from '../requests/getUserById';
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
// const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, me }) => {
// const [members, setMembers] = useState<any>();
// useEffect(() => {
//   const size = messages.length;
//   const datas: any[][] = [];
//   for (let i = 0; i < size; i++) {
//     GetUserById(messages[i].user_id)
//       .then((req) => {
//         datas.push([req.id, req.nickname]);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   setMembers(datas);
// }, [messages]);
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
            <strong style={{ color: msg.user_id === me ? 'blue' : 'red' }}>
              {/* {members[members.findIndex((element: number[]) => msg.user_id === element[0])} */}
              {msg.user_id}
            </strong>{' '}
            {msg.message}
          </div>
        ))}
      </Box>
    </Paper>
  );
};

export default ChatWindow;
