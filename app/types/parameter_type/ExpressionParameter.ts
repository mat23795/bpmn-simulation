import {ParameterValue} from "./ParameterValue";
import {Calendar} from "../calendar/Calendar";
import {ResultType} from "./ResultType";
import {DateTime} from "../DateTime";

export class ExpressionParameter extends ParameterValue{
    private _value: string;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, value: string) {
        super(validFor, instance, result, resultTimeStamp);
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }
}