import { Packet } from "../Packet"

export class PacketInKeepAlive extends Packet {
    y_pcent: number | null;
    timestamp: number;
  
    constructor(y_pcent: number | null) {
      super();
      this.y_pcent = y_pcent;
      this.timestamp = Date.now();
    }
  }