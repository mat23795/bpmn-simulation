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

    protected eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }

    // toXMLelement(bpsimPrefix: string, xml: any): any {
    //     let parser = new DOMParser();
    //     let xmlDoc = parser.parseFromString(xml, "text/xml");
    //
    //     let betaDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":BetaDistribution");
    //
    //     // TODO vedere se vanno aggiunti i parametri del padre
    //     // super.toXMLelement(expressionParameterXMLelement);
    //
    //     this.eventuallyAddAttribute(betaDistributionXMLelement, "shape", this._shape);
    //     this.eventuallyAddAttribute(betaDistributionXMLelement, "scale", this._scale);
    //
    //     return betaDistributionXMLelement;
    //
    // }
}

export class StringParameter extends ConstantParameter {

    constructor() {
        super();
    }

    // TODO vedere se qui serve il toXML
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
}

export class BooleanParameter extends ConstantParameter {

    constructor() {
        super();
    }
}

export class DurationParameter extends ConstantParameter {

    constructor() {
        super();
    }
}

export class DateTimeParameter extends ConstantParameter {

    constructor() {
        super();
    }
}

export class Duration{
    private _value: string;

    constructor() {
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
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