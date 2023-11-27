import React, { useState } from 'react';
import { type Socket } from 'socket.io-client';

const MessageInput: React.FC<Socket> = (socket) => {
  const [value, setValue] = useState('');

  const send = (value: string): void => {
    socket?.emit('message', value);
  };

  const changeTime = (value: number): void => {
    socket?.emit('updateTimer', value);
  };

  const changeClient1 = (value: number): void => {
    socket?.emit('updateClient1', value);
  };

  return (
    <>
      <div>
        <input
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Type your message"
          value={value}
        />
        <button
          onClick={() => {
            send(value);
          }}
        >
          SEND
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            changeTime(5000);
          }}
        >
          5secondes
        </button>
        <button
          onClick={() => {
            changeTime(1000);
          }}
        >
          1seconde
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            changeClient1(5);
          }}
        >
          bonjour
        </button>
      </div>
    </>
  );
};
export default MessageInput;
