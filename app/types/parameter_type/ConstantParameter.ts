import {ParameterValue} from "./ParameterValue";
import {TimeUnit} from "../scenario/TimeUnit";

export class ConstantParameter extends ParameterValue {
    protected _value: any;


    constructor() {
        super();
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }
}

export class StringParameter extends ConstantParameter {

    constructor() {
        super();
    }
}

export class NumericParameter extends ConstantParameter {
    private _timeUnit: TimeUnit;

    constructor() {
        super();
    }

    get timeUnit(): TimeUnit {
        return this._timeUnit;
    }

    set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }
}

export class FloatingParameter extends ConstantParameter {
    private _timeUnit: TimeUnit;

    constructor() {
        super();
    }

    get timeUnit(): TimeUnit {
        return this._timeUnit;
    }

    set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }
}

export class BooleanParameter extends ConstantParameter {

    constructor() {
        super();
    }
}

export class DurationParameter extends ConstantParameter {

    constructor() {
        super();
    }
}

export class DateTimeParameter extends ConstantParameter {

    constructor() {
        super();
    }
}

export class Duration{
    private _value: string;

    constructor() {
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }
}

export class DateTime{
    private _date: string;

    constructor() {
    }

    get date() : string{
        return this._date;
    }
}