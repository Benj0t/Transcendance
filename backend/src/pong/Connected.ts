import { Socket } from 'socket.io';
import { Match } from './Match';
import { PongServer } from './pong.server';

export class Connected {
    public lastSocketTimestamp: number;
    public socket: Socket;
    public userId: number;
    public ping: number;
    public opponentId: number | null;
    public match: Match;
    public readonly client: Socket; 
    public readonly pong_server: PongServer;

    private closed: boolean;

    constructor(pong_server: PongServer, client: Socket) {
        this.pong_server = pong_server;
        this.client = client;
        this.socket = client;
        this.lastSocketTimestamp = Date.now();
        this.closed = false;
        this.opponentId = null;
        this.match = null;
        this.userId = 0;
    }

    close(): void {
        this.closed = true;
        const index = this.pong_server.connecteds.indexOf(this);
      if (this.match)
      {
        this.match.forfeit(this.userId);
        console.log(`[LOG] ${this.client.id}: has left the game.`);
      }
      if (index > -1) {
        this.pong_server.connecteds.splice(index, 1);
      }
    }

    getUserId(): number {
        return this.userId;
    }

    getPing(): number {
        return this.ping;
    }

    isTimeout(): boolean {
        return Date.now() - this.lastSocketTimestamp >= 5000;
    }

    hasMatch(): boolean {
        return this.match != null;
    }
}