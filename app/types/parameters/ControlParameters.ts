import {Parameter} from "../parameter_type/Parameter";

export class ControlParameters{
    private _interTriggerTime: Parameter;
    private _triggerCount: Parameter;
    private _probability: Parameter;
    private _condition: Parameter;

    constructor(interTriggerTime: Parameter, triggerCount: Parameter, probability: Parameter, condition: Parameter) {
        this._interTriggerTime = interTriggerTime;
        this._triggerCount = triggerCount;
        this._probability = probability;
        this._condition = condition;
    }

    get interTriggerTime(): Parameter {
        return this._interTriggerTime;
    }

    set interTriggerTime(value: Parameter) {
        this._interTriggerTime = value;
    }

    get triggerCount(): Parameter {
        return this._triggerCount;
    }

    set triggerCount(value: Parameter) {
        this._triggerCount = value;
    }

    get probability(): Parameter {
        return this._probability;
    }

    set probability(value: Parameter) {
        this._probability = value;
    }

    get condition(): Parameter {
        return this._condition;
    }

    set condition(value: Parameter) {
        this._condition = value;
    }
}