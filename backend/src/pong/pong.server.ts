import {
  OnGatewayConnection,
  OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { OnModuleDestroy } from '@nestjs/common';
import { Server, Socket } from "socket.io";
import { PongService } from "./pong.service";
import { PacketInKeepAlive } from "./packet/keep.alive.packet";
import { Connected } from './Connected'
import { Match } from './Match'

@WebSocketGateway(8001, { cors: '*' })
export class PongServer implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {

    @WebSocketServer()
    private server: Server;
    public matches: Set<Match> = new Set<Match>();
    private connecteds: Connected [] = [];

    static option = {
      display: { width: 800, height: 400 },
    }

    constructor(private readonly pongService: PongService) { }

    getConnected(client: Socket): Connected | null {
        const found = this.connecteds.find(connected => connected.client === client);
    return found || null;
    }

    getConnectedByUserId(userId: number): Connected | null {
        const found = this.connecteds.find(connected => connected.userId === userId);
        return found || null;
    }

    // isConnected(userId: number): boolean {
    //     return (this.connecteds => )
    // }

    async handleConnection(client: Socket) {
        
        const tmp = new Connected(this, client);

        this.connecteds.push(tmp);

        this.pongService.handleNewConnection(this, tmp);
        
        tmp.pingInterval = setInterval(() => {
            this.pongService.sendTimePacket(this, tmp);
        }, 1000);
    }

    handleDisconnect(client: Socket): void {
        this.pongService.handleDisconnection(this, this.getConnected(client));
    }

    onModuleDestroy(): void {
        this.connecteds.forEach(connected => connected.stop());
    }

    @SubscribeMessage('keep_alive_packet')
    handleKeepAlivePacket(client: Socket, packet: PacketInKeepAlive): void {
        console.log("test")
        this.pongService.handleKeepAlivePacket(this, this.getConnected(client), packet);
    }

    createMatch(user1: Connected, user2: Connected) {
        if (user1.hasMatch() || user2.hasMatch()) return;
    
        const match = new Match(user1, user2);
        match.init();
        this.matches.add(match);
      }

    checkMatchStart(connected: Connected) {
      if (!connected.hasMatch() && connected.opponentId !== null) {
        if (connected.opponentId === 0) {
          const opponent = this.getWaitingOpponent(connected.userId);
          console.log(
            `[LOG] ${connected.client.id}: searching opponent...: ${opponent?.client.id}`
          );

          if (opponent) {
            console.log(
              `[LOG] ${connected.client.id}: found opponent: ${opponent.client.id}`
            );
            this.createMatch(connected, opponent);
          }
        } else {
          const opponent = this.getConnectedByUserId(connected.opponentId);

          if (opponent && opponent.opponentId !== null && opponent.opponentId === connected.userId) {
            this.createMatch(connected, opponent);
          }
        }
      }
    }
    
    updateMatches() {
      for (const match of Array.from(this.matches)) {
        match.update();
      }
    }

    getWaitingOpponent(searcherId: number) {
      for (const connected of Array.from(this.connecteds)) {
        if (connected.userId === searcherId) {
          continue;
        }

      if (connected.opponentId !== null && connected.opponentId === 0 && !connected.hasMatch()) {
        return connected;
    }
      }
      return null;
    }
}
