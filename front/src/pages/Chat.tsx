import React, { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import { Box } from '@mui/material';
import ProfileButton from '../components/profileButton';
import ChatInput from '../components/ChatInput';
import ChatSelect from '../components/ChatSelect';

const Chat: React.FC = () => {
  const fakeDatas = [
    { text: 'Bonjour !', sender: 'John Doe' },
    { text: 'Salut John, comment ça va ?', sender: 'Jane Doe' },
    { text: 'Ça va bien, merci ! Et toi ?', sender: 'John Doe' },
    { text: 'Je vais bien aussi, merci !', sender: 'Jane Doe' },
    { text: "As-tu des projets pour aujourd'hui ?", sender: 'John Doe' },
    { text: 'Oui, je vais travailler sur le projet de site web.', sender: 'Jane Doe' },
    { text: 'Cela semble génial ! Bonne chance !', sender: 'John Doe' },
    { text: 'Merci, je vais en avoir besoin !', sender: 'Jane Doe' },
    { text: 'Ça va bien, merci ! Et toi ?', sender: 'John Doe' },
    { text: 'Je vais bien aussi, merci !', sender: 'Jane Doe' },
    { text: "As-tu des projets pour aujourd'hui ?", sender: 'John Doe' },
    { text: 'Oui, je vais travailler sur le projet de site web.', sender: 'Jane Doe' },
    { text: 'Cela semble génial ! Bonne chance !', sender: 'John Doe' },
    { text: 'Merci, je vais en avoir besoin !', sender: 'Jane Doe' },
    { text: 'Ça va bien, merci ! Et toi ?', sender: 'John Doe' },
    { text: 'Je vais bien aussi, merci !', sender: 'Jane Doe' },
    { text: "As-tu des projets pour aujourd'hui ?", sender: 'John Doe' },
    { text: 'Oui, je vais travailler sur le projet de site web.', sender: 'Jane Doe' },
    { text: 'Cela semble génial ! Bonne chance !', sender: 'John Doe' },
    { text: 'Merci, je vais en avoir besoin !', sender: 'Jane Doe' },
    { text: 'Ça va bien, merci ! Et toi ?', sender: 'John Doe' },
    { text: 'Je vais bien aussi, merci !', sender: 'Jane Doe' },
    { text: "As-tu des projets pour aujourd'hui ?", sender: 'John Doe' },
    { text: 'Oui, je vais travailler sur le projet de site web.', sender: 'Jane Doe' },
    { text: 'Cela semble génial ! Bonne chance !', sender: 'John Doe' },
    { text: 'Merci, je vais en avoir besoin !', sender: 'Jane Doe' },
    { text: 'Ça va bien, merci ! Et toi ?', sender: 'John Doe' },
    { text: 'Je vais bien aussi, merci !', sender: 'Jane Doe' },
    { text: "As-tu des projets pour aujourd'hui ?", sender: 'John Doe' },
    { text: 'Oui, je vais travailler sur le projet de site web.', sender: 'Jane Doe' },
    { text: 'Cela semble génial ! Bonne chance !', sender: 'John Doe' },
    { text: 'Merci, je vais en avoir besoin !', sender: 'Jane Doe' },
    { text: 'Ça va bien, merci ! Et toi ?', sender: 'John Doe' },
    { text: 'Je vais bien aussi, merci !', sender: 'Jane Doe' },
    { text: "As-tu des projets pour aujourd'hui ?", sender: 'John Doe' },
    { text: 'Oui, je vais travailler sur le projet de site web.', sender: 'Jane Doe' },
    { text: 'Cela semble génial ! Bonne chance !', sender: 'John Doe' },
    { text: 'Merci, je vais en avoir besoin !', sender: 'Jane Doe' },
    { text: 'Ça va bien, merci ! Et toi ?', sender: 'John Doe' },
    { text: 'Je vais bien aussi, merci !', sender: 'Jane Doe' },
    { text: "As-tu des projets pour aujourd'hui ?", sender: 'John Doe' },
    { text: 'Oui, je vais travailler sur le projet de site web.', sender: 'Jane Doe' },
    { text: 'Cela semble génial ! Bonne chance !', sender: 'You' },
    { text: 'Merci, je vais en avoir besoin !', sender: 'Jane Doe' },
  ];

  const [message, setMessage] = useState('');
  const [history, setHistory] = useState(fakeDatas);

  const onSendMessage = (message: { text: string; sender: string }): void => {
    setHistory([...history, message]);
    console.log(message);
  };

  const handleSendMessage = (): void => {
    if (message.trim() !== '') {
      onSendMessage({ text: message, sender: 'You' });
      setMessage('');
    }
  };

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
      <Box alignSelf="flex-end">
        <ProfileButton />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        maxHeight="70%"
        width="50%"
        margin="0"
      >
        <Box width="100%" maxHeight="70%">
          <ChatWindow messages={history} onSendMessage={handleSendMessage} />
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 4fr',
              width: '100%',
              height: '100px',
            }}
          >
            <ChatSelect />
            <ChatInput
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
