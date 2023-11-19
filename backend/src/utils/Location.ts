import { Scaled } from './Scaled';
import { type Size } from './Size';

export class Location {
  scaledX: Scaled;
  scaledY: Scaled;
  readonly scale: Size;
  toLeft: boolean;

  constructor(scale: Size) {
    this.scale = scale;
    this.scaledX = new Scaled(scale.getScaledWidth());
    this.scaledY = new Scaled(scale.getScaledHeight());
    this.toLeft = false;
  }

  setToLeft(toLeft: boolean): void {
    this.toLeft = toLeft;
  }

  isToLeft(): boolean {
    return this.toLeft;
  }

  setX(xPcent: number): void {
    this.scaledX.setPercent(xPcent);
  }

  setY(yPcent: number): void {
    this.scaledY.setPercent(yPcent * 100 / 360);
  }

  setXY(xPcent: number, yPcent: number): void {
    this.setX(xPcent);
    this.setY(yPcent);
  }

  addX(xPcent: number): void {
    this.scaledX.add(xPcent);
  }

  addY(yPcent: number): void {
    this.scaledY.add(yPcent);
  }

  getX(): number {
    if (this.toLeft) {
      return this.scaledX.getMax() - this.scaledX.getValue();
    }
    return this.scaledX.getValue();
  }

  getY(): number {
    return this.scaledY.getValue();
  }

  getXPercent(): number {
    return this.scaledX.getPercent();
  }

  getYPercent(): number {
    return this.scaledY.getPercent();
  }

  getScale(): Size {
    return this.scale;
  }

  isYRange(objLocation: Location, objRange: Size, range: Size): boolean {
    const thisY1 = this.getY();
    const thisY2 = this.getY() + objRange.getHeight();
    const y1 = objLocation.getY();
    const y2 = objLocation.getY() + range.getHeight();

    if (thisY1 >= y1 && thisY1 <= y2) return true;
    if (thisY2 >= y1 && thisY1 <= y2) return true;
    if (y1 >= thisY1 && y1 <= thisY2) return true;
    if (y2 >= thisY1 && y2 <= thisY2) return true;

    return false;
  }
}

export default Location;
