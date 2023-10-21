import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer
  } from "@nestjs/websockets";
  import { OnModuleDestroy } from '@nestjs/common';
  import { Server, Socket } from "socket.io";
  import { PongService } from "./pong.service";
  
  @WebSocketGateway(8001, { cors: '*' })
  export class PongServer implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
  
    @WebSocketServer()
    private server: Server;
    
    private list: string[] = [];
    private pingInterval: NodeJS.Timeout;
    
    constructor(private readonly pongService: PongService) {}
  
    async handleConnection(client: Socket) {
      this.pongService.handleNewConnection(client, this.list);
      this.pingInterval = setInterval(() => {
        this.pongService.handlePing(client);
      }, 1000);
    }
  
    handleDisconnect(client: Socket) {
      this.pongService.handleDisconnection(client, this.list);
    }
  
    onModuleDestroy() {
      clearInterval(this.pingInterval);
    }
  }
  