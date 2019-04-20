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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let costParametersXMLelement = xmlDoc.createElement(bpsimPrefix +":CostParameters");

        if(this._fixedCost != undefined){
            costParametersXMLelement.appendChild(this._fixedCost.toXMLelement(bpsimPrefix, xml, "FixedCost"));
        }

        if(this._unitCost != undefined){
            costParametersXMLelement.appendChild(this._unitCost.toXMLelement(bpsimPrefix, xml, "UnitCost"));
        }

        return costParametersXMLelement;
    }
}