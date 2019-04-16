import {ParameterValue} from "./ParameterValue";
import {TimeUnit} from "../scenario/TimeUnit";

export class DistributionParameter extends ParameterValue{
    protected _timeUnit: TimeUnit;

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

export class BetaDistribution extends DistributionParameter{
    private _shape: number;
    private _scale: number;

    constructor() {
        super();
    }

    get shape(): number {
        return this._shape;
    }

    set shape(value: number) {
        this._shape = value;
    }

    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = value;
    }
}

export class BinomialDistribution extends DistributionParameter{
    private _probability: number;
    private _trials: number;

    constructor() {
        super();
    }

    get probability(): number {
        return this._probability;
    }

    set probability(value: number) {
        this._probability = value;
    }

    get trials(): number {
        return this._trials;
    }

    set trials(value: number) {
        this._trials = value;
    }
}

export class WeibullDistribution extends DistributionParameter{
    private _shape: number;
    private _scale: number;

    constructor() {
        super();
    }

    get shape(): number {
        return this._shape;
    }

    set shape(value: number) {
        this._shape = value;
    }

    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = value;
    }
}

export class NormalDistribution extends DistributionParameter{
    private _mean: number;
    private _standardDeviation: number;

    constructor() {
        super();
    }

    get mean(): number {
        return this._mean;
    }

    set mean(value: number) {
        this._mean = value;
    }

    get standardDeviation(): number {
        return this._standardDeviation;
    }

    set standardDeviation(value: number) {
        this._standardDeviation = value;
    }
}

export class LogNormalDistribution extends DistributionParameter{
    private _mean: number;
    private _standardDeviation: number;

    constructor() {
        super();
    }

    get mean(): number {
        return this._mean;
    }

    set mean(value: number) {
        this._mean = value;
    }

    get standardDeviation(): number {
        return this._standardDeviation;
    }

    set standardDeviation(value: number) {
        this._standardDeviation = value;
    }
}

export class UniformDistribution extends DistributionParameter{
    private _min: number;
    private _max: number;

    constructor() {
        super();
    }

    get min(): number {
        return this._min;
    }

    set min(value: number) {
        this._min = value;
    }

    get max(): number {
        return this._max;
    }

    set max(value: number) {
        this._max = value;
    }
}

export class TriangularDistribution extends DistributionParameter{
    private _min: number;
    private _max: number;
    private _mode: number;

    constructor() {
        super();
    }

    get min(): number {
        return this._min;
    }

    set min(value: number) {
        this._min = value;
    }

    get max(): number {
        return this._max;
    }

    set max(value: number) {
        this._max = value;
    }

    get mode(): number {
        return this._mode;
    }

    set mode(value: number) {
        this._mode = value;
    }
}

export class TruncatedNormalDistribution extends DistributionParameter{
    private _mean: number;
    private _standardDeviation: number;
    private _min: number;
    private _max: number;

    constructor() {
        super();
    }

    get mean(): number {
        return this._mean;
    }

    set mean(value: number) {
        this._mean = value;
    }

    get standardDeviation(): number {
        return this._standardDeviation;
    }

    set standardDeviation(value: number) {
        this._standardDeviation = value;
    }

    get min(): number {
        return this._min;
    }

    set min(value: number) {
        this._min = value;
    }

    get max(): number {
        return this._max;
    }

    set max(value: number) {
        this._max = value;
    }
}

export class PoissonDistribution extends DistributionParameter{
    private _mean: number;

    constructor() {
        super();
    }

    get mean(): number {
        return this._mean;
    }

    set mean(value: number) {
        this._mean = value;
    }
}

export class NegativeExponentialDistribution extends DistributionParameter{
    private _mean: number;

    constructor() {
        super();
    }

    get mean(): number {
        return this._mean;
    }

    set mean(value: number) {
        this._mean = value;
    }
}

export class ErlangDistribution extends DistributionParameter{
    private _mean: number;
    private _k: number;

    constructor() {
        super();
    }

    get mean(): number {
        return this._mean;
    }

    set mean(value: number) {
        this._mean = value;
    }

    get k(): number {
        return this._k;
    }

    set k(value: number) {
        this._k = value;
    }
}

export class GammaDistribution extends DistributionParameter{
    private _shape: number;
    private _scale: number;

    constructor() {
        super();
    }

    get shape(): number {
        return this._shape;
    }

    set shape(value: number) {
        this._shape = value;
    }

    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = value;
    }
}

export class UserDistribution extends DistributionParameter{
    private _points: UserDistributionDataPoint[] = [];
    private _discrete: boolean;

    constructor() {
        super();
    }

    get points(): UserDistributionDataPoint[] {
        return this._points;
    }

    set points(value: UserDistributionDataPoint[]) {
        for (let i = 0; i < value.length; i++) {
            this._points.push(value[i]);
        } 
    }

    get discrete(): boolean {
        return this._discrete;
    }

    set discrete(value: boolean) {
        this._discrete = value;
    }
}

export class UserDistributionDataPoint{
    private _probability: number;
    private _value: ParameterValue;

    constructor() {
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