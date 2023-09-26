import React from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

interface Row {
  id: number;
  firstName: string;
  lastName: string;
}

function getFullName(params: { row: Row }): string {
  const firstName = params.row.firstName === undefined ? '' : params.row.firstName;
  const lastName = params.row.lastName === undefined ? '' : params.row.lastName;
  return `${firstName} ${lastName}`;
}

const columns = [
  { field: 'firstName', headerName: 'First name', width: 100 },
  { field: 'lastName', headerName: 'Last name', width: 100 },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 150,
    valueGetter: getFullName,
  },
];

const rows: Row[] = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 6, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 7, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 8, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 9, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 10, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 11, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 12, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 13, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 14, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 15, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 16, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 17, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 18, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 19, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 20, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 21, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 22, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 23, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 24, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 25, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 26, lastName: 'Targaryen', firstName: 'Daenerys' },
];

const FriendList: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', width: '100%' }}
    >
      <Box width="80%" height="70%">
        <h1 style={{ textAlign: 'center' }}>AMIS</h1>
        <DataGrid density="comfortable" rows={rows} columns={columns} autoPageSize />
      </Box>
    </Box>
  );
};

export default FriendList;
