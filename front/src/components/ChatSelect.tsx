import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { Box } from '@mui/material';

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Créer un channel',
];

const ChatSelect: React.FC = () => {
  const [personName, setPersonName] = useState<string>('');
  const handleChangeMultiple = (event: SelectChangeEvent<typeof personName>): void => {
    console.log(event.target.value);
    setPersonName(event.target.value);
  };

  return (
    <Box>
      <FormControl style={{ maxWidth: '300px' }}>
        <InputLabel shrink htmlFor="selectChat">
          Salon
        </InputLabel>
        <Select native value={personName} onChange={handleChangeMultiple} label="Salon" autoWidth>
          {names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChatSelect;
