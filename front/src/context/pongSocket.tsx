import React, { type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { PacketInKeepAlive } from '../components/packet/in/PacketInKeepAlive';
import { UserContext } from './userContext';
import { PacketInHandshake } from '../components/packet/in/PacketInHandshake';
import GetUserMe from '../requests/getUserMe';
import Cookies from 'js-cookie';

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
  const userIsAuthenticated = Cookies.get('jwt');
  const me = useContext(UserContext).user;

  const createSocket = (): void => {
    const newSocket = io(URL, { transports: ['websocket'], withCredentials: true });
    setPongSocket(newSocket);
    let keepInterval: any;
    if (newSocket !== null && userIsAuthenticated !== undefined) {
      keepInterval = setInterval(() => {
        newSocket.emit('keep_alive_packet', new PacketInKeepAlive(me.yPcent));
      }, 50);
      GetUserMe()
        .then((reqdata) => {
          me.id = Math.ceil(Math.random() * 10); // replace with reqdata.id /!\
          if (pongSocket !== null) {
            pongSocket.emit('handshake_packet', new PacketInHandshake(me.id));
            pongSocket?.on('time_packet', (packetOutTime) => {});
          }
        })
        .catch((error) => {
          console.log(error);
          // return error page
        });
      // if (pongSocket !== null) pongSocket.emit('handshake_packet', new PacketInHandshake(me.id));
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

// void Socket;
// let pongSocket: Socket | undefined;

// export const getPongSocket = (): Socket => {
//   if (pongSocket === undefined) pongSocket = io(URL);
//   return pongSocket;
// };

// interface Context {
//   pongSocket: Socket | null;
//   createSocket: () => void;
// }

// const SocketContext = createContext<Context>({
//   pongSocket: null,
//   createSocket: () => {},
// });

// export const WebSocketProvider: React.FC = ({ children }) => {
//   const [socket, setSocket] = useState<WebSocket | null>(null);

//   const createSocket = () => {
//     const newSocket = io(URL, { transports: ['websocket', 'users'], withCredentials: true })
//     setSocket(newSocket);
//   };

//   useEffect(() => {
//     return () => {
//       if (socket) {
//         socket.close();
//       }
//     };
//   }, [socket]);

//   return (
//     < SocketContext.Provider value={{ socket, createSocket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
// export const useWebSocket = (): Context => useContext(SocketContext);

// export const pongSocket = io(URL, { transports: ['websocket', 'users'], withCredentials: true });

// export const SocketContext = createContext<Context>({
//   pongSocket,
// });

// const WebSocketContext = createContext(null);

// export const WebSocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   const createSocket = () => {
//     const newSocket = new WebSocket(URL); // Mettez votre URL de socket WebSocket ici
//     setSocket(newSocket);
//   };

//   return (
//     <WebSocketContext.Provider value={{ socket, createSocket }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocket = () => useContext(WebSocketContext);
