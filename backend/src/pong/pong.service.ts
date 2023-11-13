import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";
import { PongServer } from './pong.server';
import { PacketInKeepAlive } from './packet/PacketKeepAlive';
import { Connected } from './Connected'
@Injectable()
export class PongService {

	// handleNewConnection(pong_server: PongServer, connected: Connected) {
	// 	console.log(`${connected}: connected.`);
	// }

	// handleDisconnection(pong_server: PongServer, connected: Connected) {
	// 	console.log(`${connected}: disconnected`);
	// }

	// sendTimePacket(pong_server: PongServer, connected: Connected) {
	// 	connected.client.emit('time_packet', new PacketOutTime()); // TODO...
	// }

	// handleKeepAlivePacket(pong_server: PongServer, connected: Connected, packet: PacketInKeepAlive) {
    //     console.log(`${connected}: ${packet}`);
    // }
}
