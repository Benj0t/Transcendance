import React, { useContext, useEffect, useState } from 'react';
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
import { notifyToasterInfo, NotifyToasterInvitation } from '../components/utils/toaster';
import getUserMe from '../requests/getUserMe';
import postMessage from '../requests/postMessage';
import LoadingPage from './LoadingPage';
import getChannelUsers from '../requests/getChannelUsers';
import getChannelMessages from '../requests/getChannelMessages';
import { UserContext } from '../context/userContext';
import { PacketMessage } from '../components/packet/in/PacketMessage';
import { type PacketArrived } from '../components/packet/in/PacketArrived';
import getUsers from '../requests/getUser';
import getUserBlockedUsers from '../requests/getUserBlockedUsers';
import ButtonLeaveChannel from '../components/ButtonLeaveChannel';

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
  const [blocked, setBlocked] = useState<any>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any>();
  const [me, setMe] = useState<getUserMeResponse>();
  const [channel, setChannel] = useState<any[]>([]);
  const [channelMembers, setChannelMembers] = useState<channelUsersResponse[]>([]);
  const [selectChannel, setSelectChannel] = useState(0);
  const [history, setHistory] = useState<channelMessagesResponse[]>([]);

  const cont = useContext(UserContext).user;
  const { pongSocket, createSocket } = useWebSocket();

  const handleArrived = (param1: PacketArrived): void => {
    const newMsg: any = {
      channel_id: selectChannel,
      user_id: param1.senderId,
      message: param1.message,
      created_at: Date.now(),
    };
    if (param1.chanId === selectChannel) setHistory((prevHistory) => [...prevHistory, newMsg]);
    else notifyToasterInfo(`New message !`);
  };

  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }
    const handleReceived = (param1: PacketReceived): void => {
      NotifyToasterInvitation(`Invited to a game !`, param1.opponentId, acceptGame);
    };

    pongSocket?.on('invite_received', handleReceived);
    pongSocket?.on('message_arrived', handleArrived);

    return () => {
      pongSocket?.off('invite_received', handleReceived);
      pongSocket?.off('message_arrived', handleArrived);
    };
  }, [selectChannel]);

  const onSendMessage = (message: string): void => {
    postMessage(selectChannel, message)
      .then((response) => {
        if (response === 'ok') {
          pongSocket?.emit(
            'send_message',
            new PacketMessage(cont.id, message, selectChannel, channelMembers),
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const navigate = useNavigate();

  const acceptGame = (arg: number): void => {
    navigate(`/game?param=${arg}`);
  };

  const handleSendMessage = (message: string): void => {
    if (message.trim() !== '') {
      onSendMessage(message);
    }
  };

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
    getUsers()
      .then((req) => {
        if (req === undefined) setError(true);
        setUsers(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
    getUserChannels()
      .then((req) => {
        if (req.length !== 0 && typeof req?.[0]?.channel_id === 'number' && selectChannel === 0)
          setSelectChannel(req[0].channel_id);
        setChannel(req);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
    getUserBlockedUsers()
      .then((req) => {
        if (req === undefined) setError(true);
        setBlocked(req);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    if (selectChannel !== 0) {
      getChannelUsers(selectChannel)
        .then((req) => {
          setChannelMembers(req);
        })
        .catch((err) => {
          console.log(err);
        });
      getChannelMessages(selectChannel)
        .then((req) => {
          setHistory(req);
        })
        .catch((err) => {
          setError(true);
          console.log(err);
        });
    }
    setLoading(false);
  }, [selectChannel]);

  if (loading || error) return <LoadingPage />;
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
        <ProfileButton user={me} />
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
          <MemberList channelMembers={channelMembers} users={users} />
        </Box>
        <Box id="Chat" width="100%" maxHeight="70%">
          <ChatWindow messages={history} me={me.id} members={users} blocked={blocked} />
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
              me={me.id}
              allUsers={users}
            />
            <ChatInput handleSendMessage={handleSendMessage} />
          </Box>
        </Box>
        <Box id="channelManagement" display="flex" flexDirection="column" alignItems="end">
          <ButtonCreateChannel me={me.id} />
          <ButtonJoinChannel />
          <AdminPanel
            channelUsers={channelMembers}
            me={me}
            users={users}
            channelID={selectChannel}
          />
          <ButtonLeaveChannel
            channelID={selectChannel}
            isPrivate={channel.find((element) => element.channel_id === selectChannel)?.is_private}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
