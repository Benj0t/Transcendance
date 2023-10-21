import {
    MessageBody,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { Server } from 'socket.io'
  import { PongService } from './pong.service';

  @WebSocketGateway(8001, {cors: '*'})
  export class PongGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    constructor(private readonly pongService: PongService) {}
    private pingInterval: NodeJS.Timeout;
    
    async handleConnection( client: Socket)
  {
    // this.server.emit('ping', { data: "connected to serv" });
    console.log(`User ${client.id} Connected ༼ つ ◕_◕ ༽つ`)
    
    this.pingInterval = setInterval(() => {
      client.emit('keep_alive_packet', 'PING');
    }, 1000);

    client.on('disconnect', () => {
      clearInterval(this.pingInterval);
    });
  
    client.on('updateTimer', (newInterval) => {
      clearInterval(this.pingInterval);
      this.pingInterval = setInterval(() => {
        client.emit('ping', 'PING');
      }, newInterval);
    });
  }


  
  handleDisconnect(client: Socket)
  {
    console.log(`User ${client.id} Disconnected (◞ ‸ ◟ ；)`)
  }

  @SubscribeMessage('pong')
  handlePong(@MessageBody() data: string): void {
    console.log(data);
  }

  }



  
  