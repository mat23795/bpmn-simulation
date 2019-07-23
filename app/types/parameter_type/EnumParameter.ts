import {ParameterValue} from "./ParameterValue";
import {ConstantParameter, DateTime} from "./ConstantParameter";

export class EnumParameter extends ParameterValue{
    private _value: ConstantParameter[] = [];

    constructor() {
        super();
    }

    get value(): ConstantParameter[] {
        return this._value;
    }

    set value(value: ConstantParameter[]) {
        for (let i = 0; i < value.length; i++) {
            this._value.push(value[i]);
        }    
    }

    getType(): string{
        return "EnumParameter"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let enumParameterXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":EnumParameter");

        this.addSuperClassAttributesToXMLElement(enumParameterXMLelement);
        for(let i = 0; i < this._value.length; i++){
            enumParameterXMLelement.appendChild(this._value[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri));
        }

        return enumParameterXMLelement;

    }

    
}