import { Packet } from './Packet';

export class PacketInDual extends Packet {
  opponentId: number;

  constructor(opponentId: number) {
    super();
    this.opponentId = opponentId;
  }
}
