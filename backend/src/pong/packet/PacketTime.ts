import { Packet } from './Packet';

export class PacketOutTimeUpdate extends Packet {
  ballXPCent: number | null;
  ballYPCent: number | null;
  toLeft: boolean | null;
  opponentYPCent: number | null;
  time: number | null;
  opponentID: number | null;
  playing: boolean | null;

  constructor(
    ballXPCent: number | null,
    ballYPCent: number | null,
    toLeft: boolean | null,
    opponentYPCent: number | null,
    opponentID: number | null,
    playing: boolean | null,
    time: number | null,
  ) {
    super();
    this.ballXPCent = ballXPCent;
    this.ballYPCent = ballYPCent;
    this.toLeft = toLeft;
    this.opponentYPCent = opponentYPCent;
    this.time = time;
    this.opponentID = opponentID;
    this.playing = playing;
  }

  isPlaying(): boolean {
    return !!(this.playing ?? false);
  }

  getOpponentId(): number {
    if (!this.isPlaying()) {
      throw new Error('Pas actuellement en jeu.');
    }
    return this.opponentID != null ? this.opponentID : 0;
  }
}
