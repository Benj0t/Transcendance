import { Packet } from '../Packet';

export class PacketMessage extends Packet {
  message: string;
  senderId: number;
  chanId: number;
  channelMembers: any;

  constructor(senderId: number, message: string, chanId: number, channelMembers: any) {
    super();
    this.message = message;
    this.senderId = senderId;
    this.chanId = chanId;
    this.channelMembers = channelMembers;
  }
}