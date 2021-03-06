import {Parameter} from "../parameter_type/Parameter";

export class ResourceParameters{
    private _availability: Parameter;
    private _quantity: Parameter;
    private _selection: Parameter;
    private _role: Parameter[] = [];

    constructor(){}

    get availability(): Parameter {
        return this._availability;
    }

    set availability(value: Parameter) {
        this._availability = value;
    }

    get quantity(): Parameter {
        return this._quantity;
    }

    set quantity(value: Parameter) {
        this._quantity = value;
    }

    get selection(): Parameter {
        return this._selection;
    }

    set selection(value: Parameter) {
        this._selection = value;
    }

    get role(): Parameter[] {
        return this._role;
    }

    set role(value: Parameter[]) {
        for(let i=0; i<value.length; i++) {
            this._role.push(value[i]);
        }    
    }

    getType(): string{
        return "ResourceParameters";
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let resourceParametersXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":ResourceParameters");

        if(this._availability != undefined){
            resourceParametersXMLelement.appendChild(this._availability.toXMLelement(bpsimPrefix, bpsimNamespaceUri, "Availability"));
        }

        if(this._quantity != undefined){
            resourceParametersXMLelement.appendChild(this._quantity.toXMLelement(bpsimPrefix, bpsimNamespaceUri, "Quantity"));
        }

        if(this._selection != undefined){
            resourceParametersXMLelement.appendChild(this._selection.toXMLelement(bpsimPrefix, bpsimNamespaceUri, "Selection"));
        }

        for(let i = 0; i < this._role.length; i++){
            resourceParametersXMLelement.appendChild(this._role[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri, "Role"));
        }

        return resourceParametersXMLelement;
    }
}