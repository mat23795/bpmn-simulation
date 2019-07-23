import {Parameter} from "../parameter_type/Parameter";

export class CostParameters{
    private _fixedCost: Parameter;
    private _unitCost: Parameter;

    constructor(){}


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

    getType(): string{
        return "CostParameters"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let costParametersXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":CostParameters");

        if(this._fixedCost != undefined){
            costParametersXMLelement.appendChild(this._fixedCost.toXMLelement(bpsimPrefix, bpsimNamespaceUri, "FixedCost"));
        }

        if(this._unitCost != undefined){
            costParametersXMLelement.appendChild(this._unitCost.toXMLelement(bpsimPrefix, bpsimNamespaceUri, "UnitCost"));
        }

        return costParametersXMLelement;
    }
}