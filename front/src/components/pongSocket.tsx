import { Socket, io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8001';

void Socket;
let pongSocket: Socket | undefined;

export const getPongSocket = (): Socket => {
  if (pongSocket === undefined) pongSocket = io(URL);
  return pongSocket;
};
