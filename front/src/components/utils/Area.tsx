import React, { useState } from 'react';
import Racket from './Racket';
import Entity from './Entity';
import Size from './Size';

class Area {
    private size: Size;
    private opponent: Racket;
    private player: Racket;
    private ball: Entity;
  
    constructor(width: number, height: number, player_id: number, opponent_id: number) {
      this.size = new Size(width, height);
      this.player = new Racket(player_id, this.size);
      this.player.getLocation().setY(50);
  
      this.opponent = new Racket(opponent_id, this.size);
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