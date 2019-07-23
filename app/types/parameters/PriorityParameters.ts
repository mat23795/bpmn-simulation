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

    getType(): string{
        return "PriorityParameters"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let priorityParametersXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":PriorityParameters");

        if(this._interruptible != undefined){
            priorityParametersXMLelement.appendChild(this._interruptible.toXMLelement(bpsimPrefix, bpsimNamespaceUri, "Interruptible"));
        }

        if(this._priority != undefined){
            priorityParametersXMLelement.appendChild(this._priority.toXMLelement(bpsimPrefix, bpsimNamespaceUri, "Priority"));
        }

        return priorityParametersXMLelement;
    }
}