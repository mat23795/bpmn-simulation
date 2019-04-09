import {ParameterValue} from "./ParameterValue";
import {TimeUnit} from "../scenario/TimeUnit";
import {Calendar} from "../calendar/Calendar";
import {ResultType} from "./ResultType";
import {DateTime} from "../DateTime";

export class DistributionParameter extends ParameterValue{
    private _timeUnit: TimeUnit;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit) {
        super(validFor, instance, result, resultTimeStamp);
        this._timeUnit = timeUnit;
    }

    get timeUnit(): TimeUnit {
        return this._timeUnit;
    }

    set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }
}

export class BetaDistribution extends DistributionParameter{
    private _shape: number;
    private _scale: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, shape: number, scale: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._shape = shape;
        this._scale = scale;
    }
}

export class BinomialDistribution extends DistributionParameter{
    private _probability: number;
    private _trials: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, probability: number, trials: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._probability = probability;
        this._trials = trials;
    }
}

export class WeibullDistribution extends DistributionParameter{
    private _shape: number;
    private _scale: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, shape: number, scale: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._shape = shape;
        this._scale = scale;
    }
}

export class NormalDistribution extends DistributionParameter{
    private _mean: number;
    private _standardDeviation: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, mean: number, standardDeviation: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._mean = mean;
        this._standardDeviation = standardDeviation;
    }
}

export class LogNormalDistribution extends DistributionParameter{
    private _mean: number;
    private _standardDeviation: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, mean: number, standardDeviation: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._mean = mean;
        this._standardDeviation = standardDeviation;
    }
}

export class UniformDistribution extends DistributionParameter{
    private _min: number;
    private _max: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, min: number, max: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._min = min;
        this._max = max;
    }
}

export class TriangularDistribution extends DistributionParameter{
    private _min: number;
    private _max: number;
    private _mode: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, min: number, max: number, mode:number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._mode = mode;
        this._min = min;
        this._max = max;
    }
}

export class TruncatedNormalDistribution extends DistributionParameter{
    private _mean: number;
    private _standardDeviation: number;
    private _min: number;
    private _max: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, min: number, max: number, mean:number, standardDeviation: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._mean = mean;
        this._standardDeviation = standardDeviation;
        this._min = min;
        this._max = max;
    }
}

export class PoissonDistribution extends DistributionParameter{
    private _mean: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, mean: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._mean = mean;
    }
}

export class NegativeExponentialDistribution extends DistributionParameter{
    private _mean: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, mean: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._mean = mean;
    }
}

export class ErlangDistribution extends DistributionParameter{
    private _mean: number;
    private _k: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, mean: number, k: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._mean = mean;
        this._k = k;
    }
}

export class GammaDistribution extends DistributionParameter{
    private _shape: number;
    private _scale: number;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, shape: number, scale: number) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._shape = shape;
        this._scale = scale;
    }
}

export class UserDistribution extends DistributionParameter{
    private _points: UserDistributionDataPoint[] = [];
    private _discrete: boolean;

    constructor(validFor: Calendar, instance: string, result: ResultType, resultTimeStamp: DateTime, timeUnit: TimeUnit, points: UserDistributionDataPoint[], discrete: boolean = false) {
        super(validFor, instance, result, resultTimeStamp, timeUnit);
        this._points = points;
        this._discrete = discrete;
    }
}

export class UserDistributionDataPoint{
    private _probability: number;
    private _value: ParameterValue;

    constructor(probability: number, value: ParameterValue) {
        this._probability = probability;
        this._value = value;
    }

    get probability(): number {
        return this._probability;
    }

    set probability(value: number) {
        this._probability = value;
    }

    get value(): ParameterValue {
        return this._value;
    }

    set value(value: ParameterValue) {
        this._value = value;
    }
}