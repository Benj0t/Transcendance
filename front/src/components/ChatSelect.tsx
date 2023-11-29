import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { Box } from '@mui/material';

interface ChatSelectProps {
  changeChannel: React.Dispatch<React.SetStateAction<number>>;
  channel: number;
  channelsList: Array<{
    channel_id: number;
    is_private: boolean;
    title: string;
  }>;
}

const ChatSelect: React.FC<ChatSelectProps> = ({ changeChannel, channel, channelsList }) => {
  const handleChangeMultiple = (event: SelectChangeEvent<string>): void => {
    console.log(event.target.value);
    const selectedName = event.target.value;
    const selectedChannel = channelsList.find((item) => item.title === selectedName);
    if (selectedChannel != null) {
      changeChannel(selectedChannel.channel_id);
    }
    /// A remplacer par une vraie cond si l'User est admin du channel select
  };

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
              {index.title}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChatSelect;
