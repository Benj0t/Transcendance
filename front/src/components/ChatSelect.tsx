import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { Box } from '@mui/material';
import getChannelUsers from '../requests/getChannelUsers';
import { useEffect, useState } from 'react';

interface ChatSelectProps {
  changeChannel: React.Dispatch<React.SetStateAction<number>>;
  channel: number;
  channelsList: Array<{
    channel_id: number;
    is_private: boolean;
    title: string;
  }>;
  me: number;
  allUsers: any;
}

const ChatSelect: React.FC<ChatSelectProps> = ({
  changeChannel,
  channel,
  channelsList,
  me,
  allUsers,
}) => {
  const [usersDM, setUsersDM] = useState<any[]>([]);
  const handleChangeMultiple = (event: SelectChangeEvent<string>): void => {
    const selectedName = event.target.value;
    const selectedChannel = channelsList.find((item) => item.title === selectedName);
    if (selectedChannel != null) {
      changeChannel(selectedChannel.channel_id);
    }
    /// A remplacer par une vraie cond si l'User est admin du channel select
  };
  useEffect(() => {
    if (channelsList !== undefined) {
      const size = channelsList.length;
      for (let i = 0; i < size; i++) {
        if (channelsList[i].is_private) {
          getChannelUsers(channelsList[i].channel_id)
            .then((req) => {
              const otherUser =
                req[0]?.user_id !== me
                  ? allUsers.find((item: any) => item.id === req[0].user_id)
                  : allUsers.find((item: any) => item.id === req[1].user_id);
              if (otherUser !== undefined)
                setUsersDM((prevState: any) => [...prevState, otherUser.nickname]);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  }, [channelsList, me, allUsers]);

  let indexDM = 0;
  return (
    <Box>
      <FormControl style={{ maxWidth: '300px' }}>
        <InputLabel shrink htmlFor="selectChat">
          Salon
        </InputLabel>
        <Select
          native
          value={channelsList.find((item) => item.channel_id === channel)?.title}
          onChange={handleChangeMultiple}
          label="Salon"
          autoWidth
        >
          {channelsList.map((index) => (
            <option key={index.channel_id} value={index.title}>
              {index.is_private && usersDM !== undefined ? usersDM[indexDM++] : index.title}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChatSelect;
