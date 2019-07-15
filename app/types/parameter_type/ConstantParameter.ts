import {ParameterValue} from "./ParameterValue";
import {TimeUnit} from "../scenario/TimeUnit";

export class ConstantParameter extends ParameterValue {
    protected _value: any;

    constructor() {
        super();
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }

    getType(): string{
        return "ConstantParameter"
    }

}

export class StringParameter extends ConstantParameter {

    constructor() {
        super();
    }

    getType(): string{
        return "StringParameter"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":StringParameter");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
    
        return childParameterXMLelement;
    
    }
}

export class NumericParameter extends ConstantParameter {
    private _timeUnit: TimeUnit;

    constructor() {
        super();
    }

    get timeUnit(): TimeUnit {
        return this._timeUnit;
    }

    set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }

    getType(): string{
        return "NumericParameter"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":NumericParameter");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
        this.eventuallyAddAttribute(childParameterXMLelement, "timeUnit", this._timeUnit);
    
        return childParameterXMLelement;
    
    }
}

export class FloatingParameter extends ConstantParameter {
    private _timeUnit: TimeUnit;

    constructor() {
        super();
    }

    get timeUnit(): TimeUnit {
        return this._timeUnit;
    }

    set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }

    getType(): string{
        return "FloatingParameter"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":FloatingParameter");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
        this.eventuallyAddAttribute(childParameterXMLelement, "timeUnit", this._timeUnit);
    
        return childParameterXMLelement;
    
    }
}

export class BooleanParameter extends ConstantParameter {

    constructor() {
        super();
    }

    getType(): string{
        return "BooleanParameter"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":BooleanParameter");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
    
        return childParameterXMLelement;
    
    }
}

export class DurationParameter extends ConstantParameter {

    constructor() {
        super();
    }

    getType(): string{
        return "DurationParameter"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":DurationParameter");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
    
        return childParameterXMLelement;
    
    }
}

export class DateTimeParameter extends ConstantParameter {

    constructor() {
        super();
    }

    getType(): string{
        return "DateTimeParameter"
    }
    
    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":DateTimeParameter");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
    
        return childParameterXMLelement;
    
    }
}

export class DateTime{
    private _date: string;

    constructor() {
    }

    get date() : string{
        return this._date;
    }
}