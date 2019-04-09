import {Parameter} from "../parameter_type/Parameter";

export class CostParameters{
    private _fixedCost: Parameter;
    private _unitCost: Parameter;

    constructor(fixedCost: Parameter, unitCost: Parameter) {
        this._fixedCost = fixedCost;
        this._unitCost = unitCost;
    }

    get fixedCost(): Parameter {
        return this._fixedCost;
    }

    set fixedCost(value: Parameter) {
        this._fixedCost = value;
    }

    get unitCost(): Parameter {
        return this._unitCost;
    }

    set unitCost(value: Parameter) {
        this._unitCost = value;
    }
}