import {ParameterValue} from "./ParameterValue";
import {Calendar} from "../calendar/Calendar";
import {ResultType} from "./ResultType";
import {DateTime} from "./ConstantParameter";

export class ExpressionParameter extends ParameterValue{
    private _value: string;

    constructor() {
        super();
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    getType(): string{
        return "ExpressionParameter"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let expressionParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":ExpressionParameter");

        this.addSuperClassAttributesToXMLElement(expressionParameterXMLelement);
        this.eventuallyAddAttribute(expressionParameterXMLelement, "value", this._value);

        return expressionParameterXMLelement;

    }
}