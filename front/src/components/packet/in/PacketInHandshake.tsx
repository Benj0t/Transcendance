import { Packet } from '../Packet';

export class PacketInHandshake extends Packet {
  userId: number;

  constructor(userId: number) {
    super();
    this.userId = userId;
  }
}
