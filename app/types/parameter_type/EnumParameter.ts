import {ParameterValue} from "./ParameterValue";
import {ConstantParameter, DateTime} from "./ConstantParameter";
import {Calendar} from "../calendar/Calendar";
import {ResultType} from "./ResultType";

export class EnumParameter extends ParameterValue{
    private _values: ConstantParameter[] = [];

    constructor() {
        super();
    }

    get values(): ConstantParameter[] {
        return this._values;
    }

    set values(value: ConstantParameter[]) {
        this._values = value;
    }
}