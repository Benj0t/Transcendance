import { Packet } from "../Packet"

export class PacketOutTimeUpdate extends Packet {
    ball_x_pcent: number | null;
    ball_y_pcent: number | null;
    to_left: boolean | null;
    opponent_y_pcent: number | null;
    time: number | null;
    opponent_id: number | null;
    playing: boolean | null;
  
    constructor(
      ball_x_pcent: number | null,
      ball_y_pcent: number | null,
      to_left: boolean | null,
      opponent_y_pcent: number | null,
      opponent_id: number | null,
      playing: boolean | null,
      time: number | null
    ) {
      super();
      this.ball_x_pcent = ball_x_pcent;
      this.ball_y_pcent = ball_y_pcent;
      this.to_left = to_left;
      this.opponent_y_pcent = opponent_y_pcent;
      this.time = time;
      this.opponent_id = opponent_id;
      this.playing = playing;
    }
  
    isPlaying(): boolean {
      return !!this.playing;
    }
  
    getOpponentId(): number {
      if (!this.isPlaying()) {
        throw new Error("Pas actuellement en jeu.");
      }
      return this.opponent_id || 0;
    }
  }