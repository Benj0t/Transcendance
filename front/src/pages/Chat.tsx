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
import { useWebSocket } from '../context/pongSocket';
import { useNavigate } from 'react-router';
import { type PacketReceived } from '../components/packet/in/PacketReceived';
import { notifyToasterInivtation } from '../components/utils/toaster';

const Chat: React.FC = () => {
  const fakeDatas: Record<number, Array<{ text: string; sender: string }>> = {
    1: [
      { text: 'Salut !', sender: 'Michel' },
      { text: 'Salut !', sender: 'You' },
      { text: 'Salut !', sender: 'Michel' },
      { text: 'Salut !', sender: 'You' },
    ],
    10: [
      { text: 'Coucou !', sender: 'Sophie' },
      { text: 'Coucou !', sender: 'You' },
      { text: 'Coucou !', sender: 'Sophie' },
      { text: 'Coucou !', sender: 'You' },
    ],
    100: [
      { text: 'Hello !', sender: 'Jack' },
      { text: 'Hello !', sender: 'You' },
    ],
    1000: [
      { text: 'Bonjour !', sender: 'You' },
      { text: 'Bonjour !', sender: 'Steve' },
      { text: 'Bonjour !', sender: 'You' },
    ],
  };

  const channelsMembers = [
    { id: 1, names: ['Michel'] },
    { id: 10, names: ['Sophie'] },
    { id: 100, names: ['Jack'] },
    { id: 1000, names: ['Michel', 'Jacky', 'Medhi', 'Elias', 'Daniel'] },
  ];

  const channelTest = getUserChannels();
  console.log('Channels: ', channelTest);

  const channels = [
    { id: 1, name: 'Michel' },
    { id: 10, name: 'Sophie' },
    { id: 100, name: 'Jack' },
    { id: 1000, name: 'Les copains' },
  ];

  const [selectChannel, setSelectChannel] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [history, setHistory] = useState(fakeDatas[selectChannel]);

  const [message, setMessage] = useState('');
  const onSendMessage = (message: { text: string; sender: string }): void => {
    setHistory([...history, message]);
    console.log(message);
  };
  const { pongSocket, createSocket } = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }
  }, []);

  const acceptGame = (arg: number): void => {
    navigate(`/game?param=${arg}`);
  };

  useEffect(() => {
    const handleReceived = (param1: PacketReceived): void => {
      notifyToasterInivtation(`Invited to a game !`, param1.opponentId, acceptGame);
    };

    pongSocket?.on('invite_received', handleReceived);

    return () => {
      pongSocket?.off('invite_received', handleReceived);
    };
  }, []);

  const handleSendMessage = (): void => {
    if (message.trim() !== '') {
      onSendMessage({ text: message, sender: 'You' });
      setMessage('');
    }
  };
  useEffect(() => {
    const selectedData = fakeDatas[selectChannel];
    if (selectedData !== undefined) {
      setHistory(selectedData);
    }
  }, [selectChannel]);
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
          <MemberList channelsMembers={channelsMembers} channel={selectChannel} />
        </Box>
        <Box id="Chat" width="100%" maxHeight="70%">
          <ChatWindow messages={history} onSendMessage={handleSendMessage} />
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: '13% 10fr',
              width: '100%',
              height: '80px',
            }}
          >
            <ChatSelect
              setIsAdmin={setIsAdmin}
              channelsList={channels}
              changeChannel={setSelectChannel}
              channel={selectChannel}
            />
            <ChatInput
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
            />
          </Box>
        </Box>
        <Box id="channelManagement" display="flex" flexDirection="column" alignItems="end">
          <ButtonCreateChannel />
          <ButtonJoinChannel />
          <AdminPanel isAdmin={isAdmin} />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
