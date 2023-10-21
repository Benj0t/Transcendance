import React from 'react';
import Entity from './Entity';
import Size from './Size';

class Racket extends Entity {
  user_id: number;

  constructor(user_id: number, size: Size) {
    super(size);
    this.user_id = user_id;
  }

  getUserId() {
    return this.user_id;
  }
}

export default Racket;
