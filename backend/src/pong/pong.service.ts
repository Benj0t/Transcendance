import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";
import { PongServer } from './pong.server';
import { PacketInKeepAlive } from './packet/PacketKeepAlive';
import { Connected } from './Connected'
@Injectable()
export class PongService {
}
