import { Packet } from './Packet';

export class PacketArrived extends Packet {
  message: string;
  senderId: number;
  chanId: number;

  constructor(senderId: number, message: string, chanId: number) {
    super();
    this.message = message;
    this.senderId = senderId;
    this.chanId = chanId;
  }
}
