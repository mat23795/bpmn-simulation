import {ResultType} from "./ResultType";
import {ParameterValue} from "./ParameterValue";

export class Parameter{
    private _value: ParameterValue[];
    private _resultRequest: ResultType;

    constructor(){}


    get value(): ParameterValue[] {
        return this._value;
    }

    set value(value: ParameterValue[]) {
        for (let i = 0; i < value.length; i++) {
            this._value.push(value[i]);
        }
    }

    get resultRequest(): ResultType {
        return this._resultRequest;
    }

    set resultRequest(value: ResultType) {
        this._resultRequest = value;
    }
}