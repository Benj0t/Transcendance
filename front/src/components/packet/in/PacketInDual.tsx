import { Packet } from "../Packet"

export class PacketInDual extends Packet {
    opponent_id: number;
  
    constructor(opponent_id: number) {
      super();
      this.opponent_id = opponent_id;
    }
  }