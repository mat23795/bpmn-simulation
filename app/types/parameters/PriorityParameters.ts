import {Parameter} from "../parameter_type/Parameter";

export class PriorityParameters{
    private _interruptible: Parameter;
    private _priority: Parameter;

    constructor(interruptible: Parameter, priority: Parameter) {
        this._interruptible = interruptible;
        this._priority = priority;
    }

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