import {Parameter} from "../parameter_type/Parameter";

export class PriorityParameters{
    private _interruptible: Parameter;
    private _priority: Parameter;

    constructor(){}


    get interruptible(): Parameter {
        return this._interruptible;
    }

    set interruptible(value: Parameter) {
        this._interruptible = value;
    }

    get priority(): Parameter {
        return this._priority;
    }

    set priority(value: Parameter) {
        this._priority = value;
    }
}