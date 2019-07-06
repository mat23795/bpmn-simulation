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

    getType(): string{
        return "Property"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let propertyXMLelement = xmlDoc.createElement(bpsimPrefix +":Property");

        this.eventuallyAddAttribute(propertyXMLelement, "name", this._name);
        this.eventuallyAddAttribute(propertyXMLelement, "type", this._type);

        for(let i=0; i< this._value.length; i++) {
            propertyXMLelement.appendChild(this._value[i].toXMLelement(bpsimPrefix,xml));
        }

        //TODO verificare check su undefined per un enum
        for(let i=0; i< this._resultRequest.length; i++) {
            let resultRequestXMLelement = xmlDoc.createElement(bpsimPrefix +":ResultRequest");
            resultRequestXMLelement.textContent = this._resultRequest[i];
            propertyXMLelement.appendChild(resultRequestXMLelement);
        }

        return propertyXMLelement;        
    }

}