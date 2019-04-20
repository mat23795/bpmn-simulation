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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let betaDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":BetaDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(betaDistributionXMLelement, "shape", this._shape);
        this.eventuallyAddAttribute(betaDistributionXMLelement, "scale", this._scale);

        return betaDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let binomialDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":BinomialDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(binomialDistributionXMLelement, "probability", this._probability);
        this.eventuallyAddAttribute(binomialDistributionXMLelement, "trials", this._trials);

        return binomialDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let weibullDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":WeibullDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(weibullDistributionXMLelement, "shape", this._shape);
        this.eventuallyAddAttribute(weibullDistributionXMLelement, "scale", this._scale);

        return weibullDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let normalDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":NormalDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(normalDistributionXMLelement, "mean", this._mean);
        this.eventuallyAddAttribute(normalDistributionXMLelement, "standardDeviation", this._standardDeviation);

        return normalDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let logNormalDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":LogNormalDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(logNormalDistributionXMLelement, "mean", this._mean);
        this.eventuallyAddAttribute(logNormalDistributionXMLelement, "standardDeviation", this._standardDeviation);

        return logNormalDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let uniformDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":UniformDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(uniformDistributionXMLelement, "min", this._min);
        this.eventuallyAddAttribute(uniformDistributionXMLelement, "max", this._max);

        return uniformDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let triangularDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":TriangularDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(triangularDistributionXMLelement, "min", this._min);
        this.eventuallyAddAttribute(triangularDistributionXMLelement, "max", this._max);
        this.eventuallyAddAttribute(triangularDistributionXMLelement, "mode", this._mode);

        return triangularDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let truncatedNormalDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":TruncatedNormalDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(truncatedNormalDistributionXMLelement, "mean", this._mean);
        this.eventuallyAddAttribute(truncatedNormalDistributionXMLelement, "standardDeviation", this._standardDeviation);
        this.eventuallyAddAttribute(truncatedNormalDistributionXMLelement, "min", this._min);
        this.eventuallyAddAttribute(truncatedNormalDistributionXMLelement, "max", this._max);

        return truncatedNormalDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let poissonDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":PoissonDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(poissonDistributionXMLelement, "mean", this._mean);

        return poissonDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let negativeExponentialDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":NegativeExponentialDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(negativeExponentialDistributionXMLelement, "mean", this._mean);

        return negativeExponentialDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let erlangDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":ErlangDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(erlangDistributionXMLelement, "mean", this._mean);
        this.eventuallyAddAttribute(erlangDistributionXMLelement, "k", this._k);


        return erlangDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let gammaDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":GammaDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(gammaDistributionXMLelement, "shape", this._shape);
        this.eventuallyAddAttribute(gammaDistributionXMLelement, "scale", this._scale);

        return gammaDistributionXMLelement;

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

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let userDistributionXMLelement = xmlDoc.createElement(bpsimPrefix +":UserDistribution");

        // TODO vedere se vanno aggiunti i parametri del padre
        // super.toXMLelement(expressionParameterXMLelement);

        this.eventuallyAddAttribute(userDistributionXMLelement, "points", this._points);
        this.eventuallyAddAttribute(userDistributionXMLelement, "discrete", this._discrete);

        return userDistributionXMLelement;

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

    // TODO check se serve qui
    // toXMLelement(bpsimPrefix: string, xml: any): any {
    //     let parser = new DOMParser();
    //     let xmlDoc = parser.parseFromString(xml, "text/xml");
    //
    //     let userDistributionDataPointXMLelement = xmlDoc.createElement(bpsimPrefix +":UserDistributionDataPoint");
    //
    //     // TODO vedere se vanno aggiunti i parametri del padre
    //     // super.toXMLelement(expressionParameterXMLelement);
    //
    //     this.eventuallyAddAttribute(userDistributionDataPointXMLelement, "probability", this._probability);
    //     this.eventuallyAddAttribute(userDistributionDataPointXMLelement, "trials", this._trials);
    //
    //     return userDistributionDataPointXMLelement;
    //
    // }
}