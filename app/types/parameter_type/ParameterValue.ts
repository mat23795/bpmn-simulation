import {ResultType} from "./ResultType";
import {Calendar} from "../calendar/Calendar";
import {DateTime} from "./ConstantParameter";

export class ParameterValue{
    protected _validFor: Calendar[] = [];
    protected _instance: string;
    protected _result: ResultType;
    protected _resultTimeStamp: DateTime;

    constructor(){};


    get validFor(): Calendar[] {
        return this._validFor;
    }

    set validFor(value: Calendar[]) {
        for (let i = 0; i < value.length; i++) {
            this._validFor.push(value[i]);
        }
    }

    get instance(): string {
        return this._instance;
    }

    set instance(value: string) {
        this._instance = value;
    }

    get result(): ResultType {
        return this._result;
    }

    set result(value: ResultType) {
        this._result = value;
    }

    get resultTimeStamp(): DateTime {
        return this._resultTimeStamp;
    }

    set resultTimeStamp(value: DateTime) {
        this._resultTimeStamp = value;
    }
}
