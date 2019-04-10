import {ParameterValue} from "./ParameterValue";
import {Calendar} from "../calendar/Calendar";
import {ResultType} from "./ResultType";
import {DateTime} from "./ConstantParameter";

export class ExpressionParameter extends ParameterValue{
    private _value: string;

    constructor() {
        super();
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }
}