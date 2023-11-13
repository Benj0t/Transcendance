export class Scaled {
    private percent: number;
    private readonly min: number;
    private readonly max: number;
  
    constructor(min: number, max: number);
    constructor(other: Scaled);
  
    constructor(arg1: number | Scaled, max?: number) {
      if (typeof arg1 === 'number' && typeof max === 'number') {
        // Constructeur avec min et max en arguments
        this.min = arg1;
        this.max = max;
        this.percent = 0;
      } else if (arg1 instanceof Scaled) {
        // Constructeur avec un autre objet Scaled en argument
        const other = arg1;
        this.min = other.min;
        this.max = other.max;
        this.percent = other.percent;
      } else {
        throw new Error('Invalid constructor arguments');
      }
    }
  
    getMin(): number {
      return this.min;
    }
  
    getMax(): number {
      return this.max;
    }
  
    getValue(): number {
      return this.valueFor(this.percent);
    }
  
    valueFor(percent: number): number {
      if (percent < 0 || percent > 100) {
        throw new Error('Percent value must be between 0 and 100');
      }
      return Math.round(this.min + (this.max - this.min) * (percent / 100));
    }
  
    percentFor(value: number): number {
      if (value < this.min || value > this.max) {
        throw new Error('Value must be between min and max');
      }
      return Math.round(((value - this.min) / (this.max - this.min)) * 100);
    }
  
    add(percentToAdd: number): void {
      this.percent += percentToAdd;
      if (this.percent < 0) {
        this.percent = 0;
      }
      if (this.percent > 100) {
        this.percent = 100;
      }
    }
  
    remove(percentToRemove: number): void {
      this.percent -= percentToRemove;
      if (this.percent < 0) {
        this.percent = 0;
      }
      if (this.percent > 100) {
        this.percent = 100;
      }
    }
  
    getPercent(): number {
      return this.percent;
    }
  
    setPercent(percent: number): Scaled {
      if (percent >= 0 && percent <= 100) {
        this.percent = percent;
      } else {
        throw new Error('Percent value must be between 0 and 100');
      }
      return this;
    }
  }
  