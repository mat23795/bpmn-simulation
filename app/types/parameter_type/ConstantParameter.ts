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

}

export class StringParameter extends ConstantParameter {

    constructor() {
        super();
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":StringParamater");
    
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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":NumericParamater");
    
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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":FloatingParamater");
    
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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":BooleanParamater");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
    
        return childParameterXMLelement;
    
    }
}

export class DurationParameter extends ConstantParameter {

    constructor() {
        super();
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":DurationParamater");
    
        this.addSuperClassAttributesToXMLElement(childParameterXMLelement);
        this.eventuallyAddAttribute(childParameterXMLelement, "value", this._value);
    
        return childParameterXMLelement;
    
    }
}

export class DateTimeParameter extends ConstantParameter {

    constructor() {
        super();
    }
    
    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
    
        let childParameterXMLelement = xmlDoc.createElement(bpsimPrefix +":DateTimeParamater");
    
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