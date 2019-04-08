import {TimeUnit} from "./TimeUnit";
import {Duration} from "./Duration";
import {Parameter} from "./Parameter";
import {PropertyParameters} from "./PropertyParameters";

export class ScenarioParameters {
    private _start: Parameter;
    private _duration: Parameter;
    private _warmup: Parameter;
    private _replication: number;
    private _seed: number;
    private _baseTimeUnit: TimeUnit;
    private _baseCurrencyUnit: string;
    private _baseResultFrequency: Duration;
    private _baseResultFrequencyCumul: boolean;
    private _traceOutput: boolean;
    private _traceFormat: string;
    private _propertyParameters: PropertyParameters[];


    constructor(start: Parameter, duration: Parameter, warmup: Parameter, replication: number = 1, seed: number,
                baseTimeUnit: TimeUnit = TimeUnit.MINUTES, baseCurrencyUnit: string = "USD",
                baseResultFrequency: Duration = null, baseResultFrequencyCumul: boolean = false,
                traceOutput: boolean = false, traceFormat: string = "XES", propertyParameters: PropertyParameters[]) {
        this._start = start;
        this._duration = duration;
        this._warmup = warmup;
        this._replication = replication;
        this._seed = seed;
        this._baseTimeUnit = baseTimeUnit;
        this._baseCurrencyUnit = baseCurrencyUnit;
        this._baseResultFrequency = baseResultFrequency;
        this._baseResultFrequencyCumul = baseResultFrequencyCumul;
        this._traceOutput = traceOutput;
        this._traceFormat = traceFormat;
        this._propertyParameters = propertyParameters;
    }

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
        this._propertyParameters = value;
    }
}
