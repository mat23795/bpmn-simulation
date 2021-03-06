import {ResultType} from "./ResultType";
import {ParameterValue} from "./ParameterValue";

export class Parameter{

    protected _value: ParameterValue[] = [];
    protected _resultRequest: ResultType[] = [];

    constructor(){}

    get value(): ParameterValue[] {
        return this._value;
    }

    set value(value: ParameterValue[]) {
        for (let i = 0; i < value.length; i++) {
            this._value.push(value[i]);
        }
    }

    get resultRequest(): ResultType [] {
        return this._resultRequest;
    }

    set resultRequest(value: ResultType []) {
        for (let i = 0; i < value.length; i++) {
            this._resultRequest.push(value[i]);
        }   
    }

    protected eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }

    getType(): string{
        return "Parameter"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string, nameTag: string): any {
        
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let parameterXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri,bpsimPrefix+":"+nameTag);

        for(let i=0; i< this._value.length; i++) {
            parameterXMLelement.appendChild(this._value[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri));
        }

        for(let i=0; i< this._resultRequest.length; i++) {
            let resultRequestXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":ResultRequest");
            resultRequestXMLelement.textContent = this._resultRequest[i];

            parameterXMLelement.appendChild(resultRequestXMLelement);
        }

        return parameterXMLelement;
    }
}