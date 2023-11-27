import { Connected } from './Connected';
import { Area } from '../utils/Area';
import { Racket } from '../utils/Racket';
import { TickValue } from '../utils/TickValue';
import { PongServer } from './pong.server';

export class Match {
  public user1: Connected;
  public user2: Connected;
  public closed: boolean;
  public scoreUser1 = 0;
  public scoreUser2 = 0;
  public readonly pong_server: PongServer;

  public time: TickValue;
  public start: number;

  private ballToLeft: boolean;
  private ballSpeed: number = 2;
  public ballAngle: number = 0;

  private area: Area;

  constructor(user1: Connected, user2: Connected) {
    this.time = new TickValue(0);
    this.start = Date.now();
    this.user1 = user1;
    this.user1.match = this;
    this.user2 = user2;
    this.user2.match = this;
    this.area = new Area(PongServer.option.display.height, PongServer.option.display.width, user1.getUserId(), user2.getUserId());
    this.closed = false;
  }

  /**
   * Ferme le match.
   */

  public close(): void {
    if (this.closed) {
      return;
    }

    console.log(`[LOG] ${this.user1.client.id}: match closed.`);
    console.log(`[LOG] ${this.user2.client.id}: match closed.`);

    this.closed = true;

    this.user1.opponentId = null;
    this.user1.match = null;

    this.user2.opponentId = null;
    this.user2.match = null;

    this.user1.client.emit('end_game_packet');
    this.user2.client.emit('end_game_packet');

  }

  /**
   * Initialise le match.
   */

  public init(): void {
    console.log('[LOG] ' + this.user1.socket + ': match initialization.');
    console.log('[LOG] ' + this.user2.socket + ': match initialization.');
    this.user1.opponentId = this.user2.userId;
    this.user2.opponentId = this.user1.userId;
  }

  /**
   * Mets à jour l'angle de la balle, selon la raquette spécifiée en paramètre.
   * @param racket La raquette en collision avec la balle.
   */

  public updateBallAngle(racket: Racket): void {
    const positionRelative =
      this.area.getBall().getLocation().getY() - racket.getLocation().getY();
    const positionNormalisee =
      positionRelative / (this.area.racketSize().getHeight() / 2);
    const angleMax = 75;
    const angle = positionNormalisee * angleMax;
    this.ballAngle = Math.min(Math.max(-angleMax, angle), 25);
  }

  /**
   * Mets à jour le match (Coordonnées de la balle, le temps, les collisions, ...).
   */

  public update(): void {
    // console.log('Y :' + this.area.getBall().getLocation().getY());
    // console.log('X : ' + this.area.getBall().getLocation().getX());
    if (this.scoreUser1 === 5 || this.scoreUser2 === 5)
      this.close();
    this.time.incrementValue();
    if (Date.now() - this.start <= 5000)
      return ;
    const direction = !this.ballToLeft ? 1 : -1;

    this.area.getBall().getLocation().addX(
      direction * this.ballSpeed * Math.abs(Math.cos(this.ballAngle))
    );
    this.area.getBall().getLocation().addY(this.ballSpeed * Math.sin(this.ballAngle));

    let collision = false;
    if (
      this.area.getBall().getLocation().getXPercent() >= 95 &&
      this.area.getBall().getLocation().getXPercent() <= 99 &&
      !this.ballToLeft
    ) {
      if (
        this.area.getBall().getLocation().isYRange(
          this.area.getOpponent().getLocation(),
          this.area.ballSize(),
          this.area.racketSize()
        )
      ) {
        console.log('[LOG] detected collision (user 2)');
        this.updateBallAngle(this.area.getOpponent());
        collision = true;
      }
      // else
      // {
      //   this.scoreUser1++;
      //   this.area.ball.getLocation().setXY(50, 50);
      //   this.ballAngle = 0;
      //   this.ballSpeed = 2
      // }
    }

    if (
      this.area.getBall().getLocation().getXPercent() === 100 &&
      !this.ballToLeft
    ) {
      this.scoreUser1++;
      this.area.ball.getLocation().setXY(50, 180);
      this.ballAngle = 0;
      this.ballSpeed = 2
    }

    if (
      this.area.getBall().getLocation().getXPercent() <= 5 &&
      this.area.getBall().getLocation().getXPercent() >= 1 &&
      this.ballToLeft
    ) {
      if (
        this.area.getBall().getLocation().isYRange(
          this.area.getPlayer().getLocation(),
          this.area.ballSize(),
          this.area.racketSize()
        )
      ) {
        console.log('[LOG] detected collision (user 1)');
        this.updateBallAngle(this.area.getPlayer());
        collision = true;
      }
      // else
      // {
      //   this.scoreUser2++;
      //   this.area.ball.getLocation().setXY(50, 50);
      //   this.ballAngle = 0;
      //   this.ballSpeed = 2
      // }
    }

    if (
      this.area.getBall().getLocation().getXPercent() === 0 &&
      this.ballToLeft
    ) {
      this.scoreUser2++;
      this.area.ball.getLocation().setXY(50, 180);
      this.ballAngle = 0;
      this.ballSpeed = 2
    }

    if (this.area.getBall().getLocation().getYPercent() === 0) {
      this.ballAngle = -this.ballAngle;
    }

    if (this.area.getBall().getLocation().getYPercent() === 100) {
      this.ballAngle = -this.ballAngle;
    }

    if (collision) {
      this.ballToLeft = !this.ballToLeft;

      if (this.ballSpeed <= 4) {
        this.ballSpeed *= 1.12;
      } else if (this.ballSpeed <= 8) {
        this.ballSpeed *= 1.05;
      } else if (this.ballSpeed <= 15) {
        this.ballSpeed *= 1.01;
      }

      if (this.ballSpeed > 15) {
        this.ballSpeed = 15;
      }
    }
  }

  /**
   * @param connected L'utilisateur dont on souhaite récupérer la raquette.
   * @returns La raquette associée à l'utilisateur spécifié en paramètre.
   */

  public getRacket(connected: Connected): Racket | null {
    if (this.area.getPlayer().getUserId() === connected.getUserId()) {
      return this.area.getPlayer();
    }

    if (this.area.getOpponent().getUserId() === connected.getUserId()) {
      return this.area.getOpponent();
    }

    return null;
  }

  public getArea(): Area {
    return this.area;
  }
}
