import { Packet } from '../Packet';

export class PacketReceived extends Packet {
  opponentId: number;

  constructor(opponentId: number) {
    super();
    this.opponentId = opponentId;
  }
}