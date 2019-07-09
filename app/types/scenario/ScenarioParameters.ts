import {TimeUnit} from "./TimeUnit";
import {Parameter} from "../parameter_type/Parameter";
import {PropertyParameters} from "../parameters/PropertyParameters";

export class ScenarioParameters {

    private _start: Parameter;
    private _duration: Parameter;
    private _warmup: Parameter;
    private _replication: number = 1;
    private _seed: number;
    private _baseTimeUnit: TimeUnit = TimeUnit.minutes;
    private _baseCurrencyUnit: string = "USD";
    private _baseResultFrequency: string;
    private _baseResultFrequencyCumul: string = "false";
    private _traceOutput: string = "false";
    private _traceFormat: string = "XES";
    private _propertyParameters: PropertyParameters[] = [];

    constructor(){}

    get start(): Parameter {
        return this._start;
    }

    set start(value: Parameter) {
        this._start = value;
    }

    get duration(): Parameter {
        return this._duration;
    }

    set duration(value: Parameter) {
        this._duration = value;
    }

    get warmup(): Parameter {
        return this._warmup;
    }

    set warmup(value: Parameter) {
        this._warmup = value;
    }

    get replication(): number {
        return this._replication;
    }

    set replication(value: number) {
        this._replication = value;
    }

    get seed(): number {
        return this._seed;
    }

    set seed(value: number) {
        this._seed = value;
    }

    get baseTimeUnit(): TimeUnit {
        return this._baseTimeUnit;
    }

    set baseTimeUnit(value: TimeUnit) {
        this._baseTimeUnit = value;
    }

    get baseCurrencyUnit(): string {
        return this._baseCurrencyUnit;
    }

    set baseCurrencyUnit(value: string) {
        this._baseCurrencyUnit = value;
    }

    get baseResultFrequency(): string {
        return this._baseResultFrequency;
    }

    set baseResultFrequency(value: string) {
        this._baseResultFrequency = value;
    }

    get baseResultFrequencyCumul(): string {
        return this._baseResultFrequencyCumul;
    }

    set baseResultFrequencyCumul(value: string) {
        this._baseResultFrequencyCumul = value;
    }

    get traceOutput(): string {
        return this._traceOutput;
    }

    set traceOutput(value: string) {
        this._traceOutput = value;
    }

    get traceFormat(): string {
        return this._traceFormat;
    }

    set traceFormat(value: string) {
        this._traceFormat = value;
    }

    get propertyParameters(): PropertyParameters[] {
        return this._propertyParameters;
    }

    set propertyParameters(value: PropertyParameters[]) {
        let newPropertyParameter = [];
        for (let i = 0; i < value.length; i++) {
            newPropertyParameter.push(value[i]);
        }
        this._propertyParameters = newPropertyParameter;
    }

    getType(): string{
        return "ScenarioParameters";
    }

    private eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let scenarioParametersXMLelement = xmlDoc.createElement(bpsimPrefix + ":ScenarioParameters");

        if(this._start != undefined){
            scenarioParametersXMLelement.appendChild(this._start.toXMLelement(bpsimPrefix, xml, "Start"));
        }

        if(this._duration != undefined){
            // console.log(this);
            scenarioParametersXMLelement.appendChild(this._duration.toXMLelement(bpsimPrefix, xml, "Duration"));
        }
        if(this._warmup != undefined){
            scenarioParametersXMLelement.appendChild(this._warmup.toXMLelement(bpsimPrefix,xml, "Warmup"));
        }
        this.eventuallyAddAttribute(scenarioParametersXMLelement, "replication", this._replication);
        this.eventuallyAddAttribute(scenarioParametersXMLelement, "seed", this._seed);
        this.eventuallyAddAttribute(scenarioParametersXMLelement, "baseTimeUnit", this._baseTimeUnit);
        this.eventuallyAddAttribute(scenarioParametersXMLelement, "baseCurrencyUnit", this._baseCurrencyUnit);
        this.eventuallyAddAttribute(scenarioParametersXMLelement, "baseResultFrequency", this._baseResultFrequency);
        this.eventuallyAddAttribute(scenarioParametersXMLelement, "baseResultFrequencyCumul", this._baseResultFrequencyCumul);
        this.eventuallyAddAttribute(scenarioParametersXMLelement, "traceOutput", this._traceOutput);
        this.eventuallyAddAttribute(scenarioParametersXMLelement, "traceFormat", this._traceFormat)

        // TODO Passare a PropertyParameters
        for(let i=0; i< this._propertyParameters.length; i++) {
            scenarioParametersXMLelement.appendChild(this._propertyParameters[i].toXMLelement(bpsimPrefix,xml));
        }



        return scenarioParametersXMLelement;
    }
}
