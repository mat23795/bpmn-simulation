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

    set value(value: string) {
        this._value = value;
    }

    getType(): string{
        return "StringParameter"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":StringParameter");
    
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

    set value(value: number) {
        this._value = value;
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

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":NumericParameter");
    
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

    set value(value: number) {
        this._value = value;
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

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":FloatingParameter");
    
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

    set value(value: boolean) {
        this._value = value;
    }

    getType(): string{
        return "BooleanParameter"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":BooleanParameter");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
    
        return childParameterXMLelement;
    
    }
}

export class DurationParameter extends ConstantParameter {

    constructor() {
        super();
    }

    set value(value: string) {
        this._value = value;
    }

    getType(): string{
        return "DurationParameter"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":DurationParameter");
    
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
    
    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":DateTimeParameter");
    
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

    set date(date: string){
        this._date = date;
    }
}