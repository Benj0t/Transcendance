import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";
import { Connected, PongServer } from './pong.server';
import { PacketInKeepAlive } from './packet/keep.alive.packet';

@Injectable()
export class PongService {

	handleNewConnection(pong_server: PongServer, connected: Connected) {
		console.log(`${connected}: connected.`);
	}

	handleDisconnection(pong_server: PongServer, connected: Connected) {
		console.log(`${connected}: disconnected`);
	}

	sendTimePacket(client: Socket) {
		client.emit('time_packet', 'PING');
	}

	handleKeepAlivePacket(pong_server: PongServer, connected: Connected, packet: PacketInKeepAlive) {
        console.log(`${connected}: ${packet}`);
    }

	updateTimer(newInterval: number, pingInterval: NodeJS.Timeout, client: Socket) {
		clearInterval(pingInterval);
		return setInterval(() => {
			this.sendTimePacket(client);
		}, newInterval);
	}
}
