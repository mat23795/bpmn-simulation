import {Parameter} from "../parameter_type/Parameter";
import {PropertyType} from "./PropertyType";
import {ParameterValue} from "../parameter_type/ParameterValue";
import {ResultType} from "../parameter_type/ResultType";

export class Property extends Parameter {
    private _name: string;
    private _type: PropertyType;


    constructor(){
        super()
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get type(): PropertyType {
        return this._type;
    }

    set type(value: PropertyType) {
        this._type = value;
    }
}