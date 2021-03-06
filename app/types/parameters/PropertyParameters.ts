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
        for (let i = 0; i < value.length; i++) {
            this._property.push(value[i]);
        }    
    }

    get queueLength(): Parameter {
        return this._queueLength;
    }

    set queueLength(value: Parameter) {
        this._queueLength = value;
    }

    getType(): string{
        return "PropertyParameters"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let propertyParametersXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":PropertyParameters");

        for(let i=0; i< this._property.length; i++) {
            // qui in realtà è Property, che è figlio di Parameter, ma non essemdoci
            // la funz in Property, si prende quella del padre
            propertyParametersXMLelement.appendChild(this._property[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri));

        }

        if(this._queueLength != undefined){
            propertyParametersXMLelement.appendChild(this._queueLength.toXMLelement(bpsimPrefix, bpsimNamespaceUri, "QueueLength"));
        }

        return propertyParametersXMLelement;
    }
}