import {Parameter} from "../parameter_type/Parameter";

export class ControlParameters{
    private _interTriggerTimer: Parameter;
    private _triggerCount: Parameter;
    private _probability: Parameter;
    private _condition: Parameter;

    constructor(){}


    get interTriggerTimer(): Parameter {
        return this._interTriggerTimer;
    }

    set interTriggerTimer(value: Parameter) {
        this._interTriggerTimer = value;
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