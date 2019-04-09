import {ParameterValue} from "./ParameterValue";
import {ConstantParameter} from "./ConstantParameter";
import {Calendar} from "../calendar/Calendar";
import {ResultType} from "./ResultType";
import {DateTime} from "../DateTime";

export class EnumParameter extends ParameterValue{
    private _values: ConstantParameter[] = [];

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, values: ConstantParameter[]) {
        super(validFor, instance, result, resultTimeStamp);
        this._values = values;
    }

    get values(): ConstantParameter[] {
        return this._values;
    }

    set values(value: ConstantParameter[]) {
        this._values = value;
    }
}