import { createContext } from 'react';
import type User from './user.interface';

export interface context {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<context>({
  user: {
    id: '1',
    nickname: '',
    yPcent: 0,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
});
