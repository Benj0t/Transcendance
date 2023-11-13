import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8001';

export const pongSocket = io(URL);
