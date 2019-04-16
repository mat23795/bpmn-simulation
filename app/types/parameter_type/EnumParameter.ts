import {ParameterValue} from "./ParameterValue";
import {ConstantParameter, DateTime} from "./ConstantParameter";

export class EnumParameter extends ParameterValue{
    private _value: ConstantParameter[] = [];

    constructor() {
        super();
    }

    get values(): ConstantParameter[] {
        return this._value;
    }

    set values(value: ConstantParameter[]) {
        for (let i = 0; i < value.length; i++) {
            this._value.push(value[i]);
        }    
    }
}