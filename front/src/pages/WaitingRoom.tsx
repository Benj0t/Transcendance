import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { pongSocket } from '../components/pongSocket';

const WaitingRoom: React.FC = () => {
  const usr = useContext(UserContext).user;
  usr.timer = 200;
  clearTimeout(usr.timeout);
  usr.timeout = setInterval(() => {
    // const tmp: NodeJS.Timeout = setInterval(sendData, 50);
    // function sendData(): void {
    pongSocket.emit('keep_alive_packet', 'packetOutTime');
    console.log(usr.timer);
    // }
    // console.log(tmp);
  }, usr.timer);
  pongSocket.emit('switch_ingame');
  return <div>WaitingRoom Page</div>;
};

export default WaitingRoom;
