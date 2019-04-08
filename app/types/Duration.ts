export class Duration{
    private _value: string;


    constructor(value: string = "undefined") {
        this._value = value;
    }


    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }
}