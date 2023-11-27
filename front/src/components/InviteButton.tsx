// InviteButton.tsx

import React from 'react';
import { Button } from '@mui/material';

interface InviteButtonProps {
  onInviteClick: () => void;
}

const InviteButton: React.FC<InviteButtonProps> = ({ onInviteClick }) => {
  return (
    <Button variant="outlined" onClick={onInviteClick}>
      Invite to Play
    </Button>
  );
};

export default InviteButton;
