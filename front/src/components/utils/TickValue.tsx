

export class TickValue {
	
	value: number;

    constructor(value: number)
    {
        this.value = value;
    }


	incrementValue() {
		this.setValue(this.getValue() + 1);
	}

	decrementValue() {
		this.setValue(this.getValue() - 1);
	}

	setValue(value : number) {
		this.value = value;
	}

	setValueInTick(ticks : number) {
		this.value = ticks * 20;
	}

	isTickValue(): boolean {
		return (this.getValue() % 20 == 0);
	}

	getTickValue() : number {
        return (this.value / 20); 
    }

	getValue(): number{
        return (this.value);
    }

}