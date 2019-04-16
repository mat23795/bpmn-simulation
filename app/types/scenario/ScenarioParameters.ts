import {TimeUnit} from "./TimeUnit";
import {Parameter} from "../parameter_type/Parameter";
import {PropertyParameters} from "../parameters/PropertyParameters";
import {Duration} from "../parameter_type/ConstantParameter";

export class ScenarioParameters {
    private _start: Parameter;
    private _duration: Parameter;
    private _warmup: Parameter;
    private _replication: number = 1;
    private _seed: number;
    private _baseTimeUnit: TimeUnit = TimeUnit.minutes;
    private _baseCurrencyUnit: string = "USD";
    private _baseResultFrequency: Duration;
    private _baseResultFrequencyCumul: boolean = false;
    private _traceOutput: boolean = false;
    private _traceFormat: string = "XES";
    private _propertyParameters: PropertyParameters[];

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

    get baseResultFrequency(): Duration {
        return this._baseResultFrequency;
    }

    set baseResultFrequency(value: Duration) {
        this._baseResultFrequency = value;
    }

    get baseResultFrequencyCumul(): boolean {
        return this._baseResultFrequencyCumul;
    }

    set baseResultFrequencyCumul(value: boolean) {
        this._baseResultFrequencyCumul = value;
    }

    get traceOutput(): boolean {
        return this._traceOutput;
    }

    set traceOutput(value: boolean) {
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
        for (let i = 0; i < value.length; i++) {
            this._propertyParameters.push(value[i]);
        }
    }
}
