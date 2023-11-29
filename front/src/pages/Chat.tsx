import React, { useEffect, useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import { Box } from '@mui/material';
import ProfileButton from '../components/profileButton';
import ChatInput from '../components/ChatInput';
import ChatSelect from '../components/ChatSelect';
import ButtonCreateChannel from '../components/ButtonCreateChannel';
import ButtonJoinChannel from '../components/ButtonJoinChannel';
import MemberList from '../components/MemberList';
import AdminPanel from '../components/AdminPanel';
import getUserChannels from '../requests/getUserChannels';
import getUserMe from '../requests/getUserMe';
import postMessage from '../requests/postMessage';
import LoadingPage from './LoadingPage';
import getChannelUsers from '../requests/getChannelUsers';
import getChannelMessages from '../requests/getChannelMessages';

interface channelUsersResponse {
  channel_id: number;
  user_id: number;
  role: number;
  mute_expiry_at?: Date;
}
interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

interface channelMessagesResponse {
  channel_id: number;
  user_id: number;
  message: string;
  created_at: Date;
}

const Chat: React.FC = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<getUserMeResponse>();
  const [channel, setChannel] = useState<any[]>([]);
  const [channelMembers, setChannelMembers] = useState<channelUsersResponse[]>([]);
  const [selectChannel, setSelectChannel] = useState(0);
  const [history, setHistory] = useState<channelMessagesResponse[]>([]);

  const [message, setMessage] = useState('');

  const onSendMessage = (message: string): void => {
    postMessage(selectChannel, message)
      .then(() => {
        // LALALALA VOXY
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(message);
  };

  const handleSendMessage = (): void => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    getUserChannels()
      .then((req) => {
        setChannel(req);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getChannelUsers(selectChannel)
      .then((req) => {
        setChannelMembers(req);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectChannel]);

  useEffect(() => {
    getChannelMessages(selectChannel)
      .then((req) => {
        setHistory(req);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectChannel]);

  useEffect(() => {
    getUserMe()
      .then((req) => {
        if (req === undefined) setError(true);
        setMe(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
    setLoading(false);
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <h1>Something bad Happened</h1>;
  if (me === undefined) return <></>;
  return (
    <Box
      textAlign="right"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box id="avatar" alignSelf="flex-end">
        <ProfileButton />
      </Box>
      <Box
        id="ChatGroup"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 4fr 1fr',
        }}
        justifyContent="center"
        alignItems="center"
        maxHeight="70%"
        width="100%"
        margin="0"
      >
        <Box id="channelMembersList">
          <MemberList channelMembers={channelMembers} />
        </Box>
        <Box id="Chat" width="100%" maxHeight="70%">
          <ChatWindow messages={history} onSendMessage={handleSendMessage} me={me.id} />
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: '13% 10fr',
              width: '100%',
              height: '80px',
            }}
          >
            <ChatSelect
              changeChannel={setSelectChannel}
              channel={selectChannel}
              channelsList={channel}
            />
            <ChatInput
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
            />
          </Box>
        </Box>
        <Box id="channelManagement" display="flex" flexDirection="column" alignItems="end">
          <ButtonCreateChannel me={me.id} />
          <ButtonJoinChannel />
          <AdminPanel isAdmin />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
