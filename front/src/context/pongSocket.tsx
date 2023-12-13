import React, { type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { PacketInKeepAlive } from '../components/packet/in/PacketInKeepAlive';
import { UserContext } from './userContext';
import { PacketInHandshake } from '../components/packet/in/PacketInHandshake';
import GetUserMe from '../requests/getUserMe';

const URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8001';

interface Context {
  pongSocket: Socket | null;
  createSocket: () => void;
}

const SocketContext = createContext<Context>({
  pongSocket: null,
  createSocket: () => {},
});

export const SocketProvider = (props: { children: ReactNode }): any => {
  const [pongSocket, setPongSocket] = useState<Socket | null>(null);
  const me = useContext(UserContext).user;

  const createSocket = (): void => {
    const newSocket = io(URL, { transports: ['websocket'], withCredentials: true });
    setPongSocket(newSocket);
    let keepInterval: any;
    if (newSocket !== null) {
      keepInterval = setInterval(() => {
        newSocket.emit('keep_alive_packet', new PacketInKeepAlive(me.yPcent));
        newSocket.emit('handshake_packet', new PacketInHandshake(me.id));
      }, 50);
      GetUserMe()
        .then((reqdata) => {
          // me.id = reqdata.id;
          // if (pongSocket !== null) {
          //   pongSocket?.on('time_packet', (packetOutTime) => {});
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (pongSocket !== null)
      pongSocket.on('disconnect', () => {
        clearInterval(keepInterval);
      });
  };

  useEffect(() => {
    return () => {
      if (pongSocket !== null) {
        pongSocket.close();
      }
    };
  }, [pongSocket]);

  return (
    <SocketContext.Provider value={{ pongSocket, createSocket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useWebSocket = (): Context => useContext(SocketContext);
