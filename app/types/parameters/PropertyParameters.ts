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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let propertyParametersXMLelement = xmlDoc.createElement(bpsimPrefix + ":PropertyParameters");

        //TODO passare a Property
        for(let i=0; i< this._property.length; i++) {
            propertyParametersXMLelement.appendChild(this._property[i].toXMLelement(bpsimPrefix,xml));
        }

        //TODO Property e Parameter uguali???

        //TODO passare a Parameter
        if(this._queueLength != undefined){
            propertyParametersXMLelement.appendChild(this._queueLength.toXMLelement(bpsimPrefix,xml));
        }

        return propertyParametersXMLelement;
    }
}