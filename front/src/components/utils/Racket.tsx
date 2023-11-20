// import React from 'react';
import Entity from './Entity';
import type Size from './Size';

class Racket extends Entity {
  userId: number;

  constructor(userId: number, size: Size) {
    super(size);
    this.userId = userId;
  }

  getUserId(): number {
    return this.userId;
  }
}

export default Racket;
