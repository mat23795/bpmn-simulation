import {Calendar} from "../calendar/Calendar";
import {ResultType} from "./ResultType";
import {ParameterValue} from "./ParameterValue";
import {TimeUnit} from "../scenario/TimeUnit";

export class ConstantParameter extends ParameterValue {
    private _value: any;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, value: any) {
        super(validFor, instance, result, resultTimeStamp);
        this._value = value;
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }
}

export class StringParameter extends ConstantParameter {

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, value: string) {
        super(validFor, instance, result, resultTimeStamp, value);
    }
}

export class NumericParameter extends ConstantParameter {
    private _timeUnit: TimeUnit;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, value: number,
                timeUnit: TimeUnit) {
        super(validFor, instance, result, resultTimeStamp, value);
        this._timeUnit = timeUnit;
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

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, value: number,
                timeUnit: TimeUnit) {
        super(validFor, instance, result, resultTimeStamp, value);
        this._timeUnit = timeUnit;
    }

    get timeUnit(): TimeUnit {
        return this._timeUnit;
    }

    set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }
}

export class BooleanParameter extends ConstantParameter {

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, value: boolean) {
        super(validFor, instance, result, resultTimeStamp, value);
    }
}

export class DurationParameter extends ConstantParameter {

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, value: Duration) {
        super(validFor, instance, result, resultTimeStamp, value);
    }
}

export class DateTimeParameter extends ConstantParameter {

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, value: DateTime) {
        super(validFor, instance, result, resultTimeStamp, value);
    }
}

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

export class DateTime{
    private _date: string;
    constructor(year: number, month: number, day: number,
                hour: number = 0, minutes: number = 0, seconds: number = 0){
        var temp = new Date(Date.UTC(year,month,day,hour,minutes,seconds));
        this._date = temp.toISOString();
    }

    get date() : string{
        return this._date;
    }
}