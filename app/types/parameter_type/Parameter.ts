import {ResultType} from "./ResultType";
import {ParameterValue} from "./ParameterValue";

export class Parameter{
    private _value: ParameterValue;
    private _resultRequest: ResultType;

    constructor(value: ParameterValue, resultRequest: ResultType) {
        this._value = value;
        this._resultRequest = resultRequest;
    }


}