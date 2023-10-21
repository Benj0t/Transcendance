import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";

@Injectable()
export class PongService {

  handleNewConnection(client: Socket, list: any[]) {
    console.log(`User ${client.id}: connected.`);
    list.push(client.id);
  } 

  handleDisconnection(client: Socket, list: any[]) {
    console.log(`User ${client.id}: disconnected`);
    const index = list.indexOf(client.id);
    if (index > -1) {
      list.splice(index, 1);
    }
  }

  handlePing(client: Socket) {
    client.emit('ping', 'PING');
  }

  updateTimer(newInterval: number, pingInterval: NodeJS.Timeout, client: Socket) {
    clearInterval(pingInterval);
    return setInterval(() => {
      this.handlePing(client);
    }, newInterval);
  }
}
