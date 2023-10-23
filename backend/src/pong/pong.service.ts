import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";
import { Connected, PongServer } from './pong.server';
import { PacketInKeepAlive } from './packet/keep.alive.packet';
import { PacketOutTime } from './packet/time.packet';

@Injectable()
export class PongService {

	handleNewConnection(pong_server: PongServer, connected: Connected) {
		console.log(`${connected}: connected.`);
	}

	handleDisconnection(pong_server: PongServer, connected: Connected) {
		console.log(`${connected}: disconnected`);
	}

	sendTimePacket(pong_server: PongServer, connected: Connected) {
		connected.client.emit('time_packet', new PacketOutTime()); // TODO...
		connected.isIngame = 1;
	}

	handleKeepAlivePacket(pong_server: PongServer, connected: Connected, packet: PacketInKeepAlive) {
        console.log(`${connected}: ${packet}`);
    }
}
