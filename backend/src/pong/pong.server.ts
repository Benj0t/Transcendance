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
import { PacketInKeepAlive } from "./packet/PacketKeepAlive";
import { Match } from './Match';
import { Connected } from './Connected';
import { PacketOutTimeUpdate } from "./packet/PacketTime";
import Racket from "src/utils/Racket";
import { PacketInDual } from "./packet/PacketInDual";
import { PacketInDualCancel } from "./packet/PacketInDualCancel";
import { PacketInHandshake } from "./packet/PacketInHandshake";

@WebSocketGateway(8001, { cors: '*' })
export class PongServer implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {

  @WebSocketServer()
  private server: Server;
  public matches: Set<Match> = new Set<Match>();
  public connecteds: Connected[] = [];
  public pingInterval: NodeJS.Timeout;

  static option = {
    display: { width: 800, height: 400 },
  }

  constructor(private readonly pongService: PongService) {
    this.pingInterval = setInterval(() => {
      this.update();
    }, 50);
  }

  update() {

    for (const connected of this.connecteds) { // for each connected
      this.sendTimePacket(connected);
      this.checkMatchStart(connected);
    }
    this.updateMatches();
  }

  sendTimePacket(connected: Connected) {
    let ball_x_pcent: number = null;
		let ball_y_pcent: number = null;
		let to_left: boolean = null;
		let opponent_y_pcent: number = null;
		let match_time: number = null;

		if (connected.hasMatch()) {

			ball_x_pcent = connected.match.getArea().getBall().getLocation().getXPercent();
			ball_y_pcent = connected.match.getArea().getBall().getLocation().getYPercent();
			to_left = connected.match.user1.userId != connected.getUserId();

			const opponent: Racket = to_left ? connected.match.getArea().getPlayer() : connected.match.getArea().getOpponent();

			opponent_y_pcent = opponent.getLocation().getYPercent();

			match_time = connected.match.time.getTickValue();
		}

		const packet: PacketOutTimeUpdate = new PacketOutTimeUpdate(
				ball_x_pcent, ball_y_pcent, to_left, opponent_y_pcent, connected.opponentId,
				connected.hasMatch(), match_time, connected.hasMatch() ? connected.match.scoreUser1 : null,
        connected.hasMatch() ? connected.match.scoreUser2 : null,
        connected.hasMatch() ? connected.match.start : null );

    connected.client.emit('time_packet', packet);
  }

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
  }

  handleDisconnect(client: Socket): void {
    if (this.getConnected(client).match !== null)
      this.getConnected(client).opponentId = null;
    if (this.getConnected(client))
      this.getConnected(client).close();
  }

  onModuleDestroy(): void {
    this.connecteds.forEach(connected => connected.close());
  }

  @SubscribeMessage('keep_alive_packet')
  handleKeepAlivePacket(client: Socket, packet: PacketInKeepAlive): void {
    // console.log("received keep_alive_packet from", client.id);
    const connected: Connected = this.getConnected(client);

    connected.lastSocketTimestamp = Date.now(); // temps actuel en ms
    // console.log(packet.yPcent);

    if (connected.hasMatch() && packet.yPcent != null) {
      connected.match.getRacket(connected).getLocation().setY(packet.yPcent);
    }
  }

  @SubscribeMessage('handshake_packet')
  handleHandshakePacket(client: Socket, packet: PacketInHandshake): void {
    const connected: Connected = this.getConnected(client);
    connected.userId = packet.userId;
    // this.userService.addMatch(packet.userId, packet.userId, packet.userId);
  }

  @SubscribeMessage('dual_packet')
  handleDualPacket(client: Socket, packet: PacketInDual): void {
    console.log("received dual_packet from", client.id);
    const connected: Connected = this.getConnected(client);

    if (connected.hasMatch()) {
      return ;
    }

    if (connected.userId == packet.opponentId) {
     console.log(`[ERR] user dual himself.`);
      // System.exit(1); ??
      return ;
    }

    connected.opponentId = packet.opponentId;
    return ;
  }

  @SubscribeMessage('dual_cancel_packet')
  handleDualCancelPacket(client: Socket, packet: PacketInDualCancel): void {
    const connected: Connected = this.getConnected(client);

    if (connected.opponentId === null) {
      return ;
    }

    if (connected.hasMatch()) {
      connected.match.close();
      return ;
    }

    connected.opponentId = null;
  }

  createMatch(user1: Connected, user2: Connected, mode: number) {
    if (user1.hasMatch() || user2.hasMatch()) return;

    const match = new Match(user1, user2, mode);
    match.init();
    this.matches.add(match);
  }

  checkMatchStart(connected: Connected) {
    if (!connected.hasMatch() && connected.opponentId !== null) {
      if (connected.opponentId === 0 || connected.opponentId === -1 || connected.opponentId === -2) {
        const opponent = this.getWaitingOpponent(connected.userId, connected.opponentId);
        console.log(
          `[LOG] ${connected.client.id}: searching opponent...`
        );

        if (opponent) {
          console.log(
            `[LOG] ${connected.client.id}: found opponent: ${opponent.op.client.id}`
          );
          this.createMatch(connected, opponent.op, opponent.mode);
        }
      } else {
        const opponent = this.getConnectedByUserId(connected.opponentId);

        if (opponent && opponent.opponentId !== null && opponent.opponentId === connected.userId) {
          this.createMatch(connected, opponent, 0);
        }
      }
    }
  }

  updateMatches() {
    for (const match of Array.from(this.matches)) {
      if (match.closed === false) match.update();
    }
  }

  getWaitingOpponent(searcherId: number, mode: number) {
    for (const connected of Array.from(this.connecteds)) {
      if (connected.userId === searcherId) {
        continue;
      }

      if (connected.opponentId !== null && connected.opponentId === mode && !connected.hasMatch()) {
        return {op: connected, mode: mode};
      }
    }
    return null;
  }
}
