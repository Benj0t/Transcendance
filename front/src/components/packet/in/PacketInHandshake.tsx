import { Packet } from "../Packet"

export class PacketInHandshake extends Packet {
    user_id: number;
  
    constructor(user_id: number) {
      super();
      this.user_id = user_id;
    }
  }