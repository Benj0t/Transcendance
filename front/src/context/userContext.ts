import { createContext } from 'react';
import type User from '../interface/user.interface';

export interface context {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<context>({
  user: {
    id: 0,
    timer: 1000,
    timeout: setTimeout(() => {}, 1000),
  },
  setUser: () => {},
});
