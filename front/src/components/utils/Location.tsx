import { Scaled } from "./Scaled"
import { Size } from "./Size"

export class Location {

    scaled_x: Scaled;
    scaled_y: Scaled;
    private scale: Size;
    to_left: boolean;
  
    constructor(scale: Size) {
      this.scale = scale;
      this.scaled_x = new Scaled(scale.getScaledWidth());
      this.scaled_y = new Scaled(scale.getScaledHeight());
      this.to_left = false;
    }
  
    setToLeft(to_left: boolean) {
      this.to_left = to_left;
    }
  
    isToLeft(): boolean {
      return this.to_left;
    }
  
    setX(x_pcent: number) {
      this.scaled_x.setPercent(x_pcent);
    }
  
    setY(y_pcent: number) {
      this.scaled_y.setPercent(y_pcent);
    }
  
    setXY(x_pcent: number, y_pcent: number) {
      this.setX(x_pcent);
      this.setY(y_pcent);
    }
  
    addX(x_pcent: number) {
      this.scaled_x.add(x_pcent);
    }
  
    addY(y_pcent: number) {
      this.scaled_y.add(y_pcent);
    }
  
    getX(): number {
      if (this.to_left) {
        return this.scaled_x.getMax() - this.scaled_x.getValue();
      }
      return this.scaled_x.getValue();
    }
  
    getY(): number {
      return this.scaled_y.getValue();
    }
  
    getXPercent(): number {
      return this.scaled_x.getPercent();
    }
  
    getYPercent(): number {
      return this.scaled_y.getPercent();
    }
  
    getScale(): Size {
      return this.scale;
    }
  
    isYRange(obj_location: Location, obj_range: Size, range: Size): boolean {
      const this_y1 = this.getY();
      const this_y2 = this.getY() + obj_range.getHeight();
      const y1 = obj_location.getY();
      const y2 = obj_location.getY() + range.getHeight();
  
      if (this_y1 >= y1 && this_y1 <= y2) return true;
      if (this_y2 >= y1 && this_y1 <= y2) return true;
      if (y1 >= this_y1 && y1 <= this_y2) return true;
      if (y2 >= this_y1 && y2 <= this_y2) return true;
  
      return false;
    }
  }

  export default Location;