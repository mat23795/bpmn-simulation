import {Parameter} from "../parameter_type/Parameter";

export class TimeParameters{
    private _transferTime: Parameter;
    private _queueTime: Parameter;
    private _waitTime: Parameter;
    private _setupTime: Parameter;
    private _processingTime: Parameter;
    private _validationTime: Parameter;
    private _reworkTime: Parameter;
    private _lagTime: Parameter;
    private _duration: Parameter;
    private _elapsedTime: Parameter;

    constructor(){}

    get transferTime(): Parameter {
        return this._transferTime;
    }

    set transferTime(value: Parameter) {
        this._transferTime = value;
    }

    get queueTime(): Parameter {
        return this._queueTime;
    }

    set queueTime(value: Parameter) {
        this._queueTime = value;
    }

    get waitTime(): Parameter {
        return this._waitTime;
    }

    set waitTime(value: Parameter) {
        this._waitTime = value;
    }

    get setupTime(): Parameter {
        return this._setupTime;
    }

    set setupTime(value: Parameter) {
        this._setupTime = value;
    }

    get processingTime(): Parameter {
        return this._processingTime;
    }

    set processingTime(value: Parameter) {
        this._processingTime = value;
    }

    get validationTime(): Parameter {
        return this._validationTime;
    }

    set validationTime(value: Parameter) {
        this._validationTime = value;
    }

    get reworkTime(): Parameter {
        return this._reworkTime;
    }

    set reworkTime(value: Parameter) {
        this._reworkTime = value;
    }

    get lagTime(): Parameter {
        return this._lagTime;
    }

    set lagTime(value: Parameter) {
        this._lagTime = value;
    }

    get duration(): Parameter {
        return this._duration;
    }

    set duration(value: Parameter) {
        this._duration = value;
    }

    get elapsedTime(): Parameter {
        return this._elapsedTime;
    }

    set elapsedTime(value: Parameter) {
        this._elapsedTime = value;
    }
}