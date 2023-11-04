import { type Size } from './Size';
import Location from './Location';

export class Entity {
  location: Location;

  constructor(size: Size) {
    this.location = new Location(size);
  }

  getLocation(): Location {
    return this.location;
  }
}

export default Entity;
