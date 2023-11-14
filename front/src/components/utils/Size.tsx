import { Scaled } from './Scaled';

export class Size {
  scaled_width: Scaled;
  scaled_height: Scaled;

  constructor(width: number, height: number) {
    this.scaled_width = new Scaled(0, width);
    this.scaled_height = new Scaled(0, height);
  }

  sizeFor(widthPercent: number, heightPercent: number): Size {
    const width = this.scaled_width.valueFor(widthPercent);
    const height = this.scaled_height.valueFor(heightPercent);
    // console.log('Width - >', width);
    // console.log('height - >', height);

    return new Size(width, height);
  }

  getWidth(): number {
    return this.scaled_width.getMax();
  }

  getHeight(): number {
    return this.scaled_height.getMax();
  }

  getScaledWidth(): Scaled {
    return this.scaled_width;
  }

  getScaledHeight(): Scaled {
    return this.scaled_height;
  }
}

export default Size;
