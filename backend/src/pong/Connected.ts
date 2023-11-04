import { Socket } from 'socket.io';
import { PongServer } from './pong.server';

export class Connected {
    public lastSocketTimestamp: number;
    public socket: Socket;
    public userId: number;
    public ping: number;
    public opponentId: number | null;
    public match: any;
    public readonly client: Socket; 
    public readonly pong_server: PongServer;
    public pingInterval: NodeJS.Timeout;

    private closed: boolean;

    constructor(pong_server: PongServer, client: Socket) {
        this.pong_server = pong_server;
        this.client = client;
        this.socket = client;
        this.lastSocketTimestamp = Date.now();
        this.closed = false;
    }

    close() {
        this.closed = true;
        this.pong_server.handleDisconnect(this.client);
    }

    getUserId() {
        return this.userId;
    }

    getPing() {
        return this.ping;
    }

    isTimeout() {
        return Date.now() - this.lastSocketTimestamp >= 5000;
    }

    hasMatch() {
        return this.match != null;
    }
    
    stop(): void {
        clearInterval(this.pingInterval);
    }
}