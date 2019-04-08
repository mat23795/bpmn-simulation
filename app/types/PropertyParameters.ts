import {Parameter} from "./Parameter";
import {Property} from "./Property";

export class PropertyParameters{
    private _property: Property[] = [];
    private _queueLength: Parameter;


    constructor(property: Property[], queueLength: Parameter) {
        this._property = property;
        this._queueLength = queueLength;
    }

}