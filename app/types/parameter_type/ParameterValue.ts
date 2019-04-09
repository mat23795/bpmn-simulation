import {ResultType} from "./ResultType";
import {Calendar} from "../calendar/Calendar";
import {DateTime} from "./ConstantParameter";

export class ParameterValue{
    private _validFor: Calendar;
    private _instance: string;
    private _result: ResultType;
    private _resultTimeStamp: DateTime;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime) {
        this._validFor = validFor;
        this._instance = instance;
        this._result = result;
        this._resultTimeStamp = resultTimeStamp;
    }


    get validFor(): Calendar {
        return this._validFor;
    }

    set validFor(value: Calendar) {
        this._validFor = value;
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
