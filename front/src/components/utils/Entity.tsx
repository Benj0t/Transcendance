import React from 'react';
import { Scaled } from "./Scaled"
import { Size } from "./Size"
import Location from './Location';

class Entity {
  location: Location;

  constructor(size: Size) {
    this.location = new Location(size);
  }

  getLocation() {
    return this.location;
  }
}

  export default Entity;