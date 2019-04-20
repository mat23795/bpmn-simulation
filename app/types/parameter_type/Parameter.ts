import {ResultType} from "./ResultType";
import {ParameterValue} from "./ParameterValue";

export class Parameter{

    private _value: ParameterValue[] = [];
    private _resultRequest: ResultType;

    constructor(){}


    get value(): ParameterValue[] {
        return this._value;
    }

    set value(value: ParameterValue[]) {
        for (let i = 0; i < value.length; i++) {
            this._value.push(value[i]);
        }
    }

    get resultRequest(): ResultType {
        return this._resultRequest;
    }

    set resultRequest(value: ResultType) {
        this._resultRequest = value;
    }

    private eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }

    toXMLelement(bpsimPrefix: string, xml: any, nameTag: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let parameterXMLelement = xmlDoc.createElement(bpsimPrefix +":"+ nameTag);

        for(let i=0; i< this._value.length; i++) {
            parameterXMLelement.appendChild(this._value[i].toXMLelement(bpsimPrefix,xml));
        }

        //TODO verificare check su undefined per un enum
        if(this._resultRequest != undefined){
            let resultRequestXMLelement = xmlDoc.createElement(bpsimPrefix +":ResultRequest");
            resultRequestXMLelement.textContent = this._resultRequest;
        }

        //TODO finirla

        return parameterXMLelement;
    }
}