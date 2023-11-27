import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { Box } from '@mui/material';

interface ChatSelectProps {
  changeChannel: React.Dispatch<React.SetStateAction<number>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  channel: number;
  channelsList: Array<{
    id: number;
    name: string;
  }>;
}

const ChatSelect: React.FC<ChatSelectProps> = ({
  changeChannel,
  channelsList,
  channel,
  setIsAdmin,
}) => {
  const handleChangeMultiple = (event: SelectChangeEvent<string>): void => {
    console.log(event.target.value);
    const selectedName = event.target.value;
    const selectedChannel = channelsList.find((item) => item.name === selectedName);
    if (selectedChannel != null) {
      changeChannel(selectedChannel.id);
      if (selectedChannel.id === 1000) setIsAdmin(true);
      else {
        setIsAdmin(false);
      }
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
          value={channelsList.find((item) => item.id === channel)?.name}
          onChange={handleChangeMultiple}
          label="Salon"
          autoWidth
        >
          {channelsList.map((index) => (
            <option key={index.id} value={index.name}>
              {index.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChatSelect;
