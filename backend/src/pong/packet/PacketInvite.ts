import { Packet } from './Packet';

export class PacketInInvite extends Packet {
  opponentId: number;
  senderId: number

  constructor(opponentId: number, senderId: number) {
    super();
    this.opponentId = opponentId;
    this.senderId = senderId;
  }
}
