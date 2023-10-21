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

@WebSocketGateway(8001, { cors: '*' })
export class PongServer implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {

    @WebSocketServer()
    private server: Server;

    private connecteds: Connected [] = [];

    constructor(private readonly pongService: PongService) { }

    getConnected(client: Socket): Connected | null {
        const found = this.connecteds.find(connected => connected.client === client);
    return found || null;
    }

    // isConnected(user_id: number): boolean {
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
}

export class Connected {

    public readonly pong_server: PongServer;
    public readonly client: Socket;

    public pingInterval: NodeJS.Timeout;

    constructor(pong_server: PongServer, client: Socket) {
        
        this.pong_server = pong_server;
        this.client = client;
    }

    stop(): void {
        clearInterval(this.pingInterval);
    }
}
