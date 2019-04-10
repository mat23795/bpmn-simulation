import {ResultType} from "./ResultType";
import {ParameterValue} from "./ParameterValue";

export class Parameter{
    private _value: ParameterValue;
    private _resultRequest: ResultType;

    constructor(){}


    get value(): ParameterValue {
        return this._value;
    }

    set value(value: ParameterValue) {
        this._value = value;
    }

    get resultRequest(): ResultType {
        return this._resultRequest;
    }

    set resultRequest(value: ResultType) {
        this._resultRequest = value;
    }
}