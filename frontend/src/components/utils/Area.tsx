// import React, { useState } from 'react';
import Racket from './Racket';
import Entity from './Entity';
import Size from './Size';

class Area {
  readonly size: Size;
  readonly opponent: Racket;
  readonly player: Racket;
  readonly ball: Entity;

  constructor(width: number, height: number, playerId: number, opponentId: number) {
    this.size = new Size(width, height);
    this.player = new Racket(playerId, this.size);
    this.player.getLocation().setY(50);

    this.opponent = new Racket(opponentId, this.size);
    this.opponent.getLocation().setY(50);
    this.opponent.getLocation().setToLeft(true);

    this.ball = new Entity(this.size);
    this.ball.getLocation().setXY(50, 50);
  }

  racketSize(): Size {
    return this.size.sizeFor(1, 10);
  }

  ballSize(): Size {
    return this.size.sizeFor(1, 10);
  }

  getOpponent(): Racket {
    return this.opponent;
  }

  getPlayer(): Racket {
    return this.player;
  }

  getBall(): Entity {
    return this.ball;
  }

  getSize(): Size {
    return this.size;
  }
}

export default Area;
