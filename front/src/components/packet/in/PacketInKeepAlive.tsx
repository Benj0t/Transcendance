import { Packet } from '../Packet';

export class PacketInKeepAlive extends Packet {
  yPcent: number | null;
  timestamp: number;

  constructor(yPcent: number | null) {
    super();
    this.yPcent = yPcent;
    this.timestamp = Date.now();
  }
}
