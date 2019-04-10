import {Parameter} from "../parameter_type/Parameter";
import {Property} from "./Property";

export class PropertyParameters{
    private _property: Property[] = [];
    private _queueLength: Parameter;


    constructor(){
    }

    get property(): Property[] {
        return this._property;
    }

    set property(value: Property[]) {
        this._property = value;
    }

    get queueLength(): Parameter {
        return this._queueLength;
    }

    set queueLength(value: Parameter) {
        this._queueLength = value;
    }
}