import { ParameterValue } from "./ParameterValue";
import { TimeUnit } from "../scenario/TimeUnit";

export class DistributionParameter extends ParameterValue {
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

    getType(): string {
        return "DistributionParameter"
    }

    protected addTimeUnitToSuperClassAttributesToXMLElement(elementXML: any) {
        this.addSuperClassAttributesToXMLElement(elementXML);
        this.eventuallyAddAttribute(elementXML, "timeUnit", this._timeUnit);
    }
}

export class BetaDistribution extends DistributionParameter {
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

    getType(): string {
        return "BetaDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let betaDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":BetaDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(betaDistributionXMLelement);
        this.eventuallyAddAttribute(betaDistributionXMLelement, "shape", this._shape);
        this.eventuallyAddAttribute(betaDistributionXMLelement, "scale", this._scale);

        return betaDistributionXMLelement;

    }
}

export class BinomialDistribution extends DistributionParameter {
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

    getType(): string {
        return "BinomialDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let binomialDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":BinomialDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(binomialDistributionXMLelement);
        this.eventuallyAddAttribute(binomialDistributionXMLelement, "probability", this._probability);
        this.eventuallyAddAttribute(binomialDistributionXMLelement, "trials", this._trials);

        return binomialDistributionXMLelement;

    }
}

export class WeibullDistribution extends DistributionParameter {
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

    getType(): string {
        return "WeibullDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let weibullDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":WeibullDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(weibullDistributionXMLelement);
        this.eventuallyAddAttribute(weibullDistributionXMLelement, "shape", this._shape);
        this.eventuallyAddAttribute(weibullDistributionXMLelement, "scale", this._scale);

        return weibullDistributionXMLelement;

    }
}

export class NormalDistribution extends DistributionParameter {
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

    getType(): string {
        return "NormalDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let normalDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":NormalDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(normalDistributionXMLelement);
        this.eventuallyAddAttribute(normalDistributionXMLelement, "mean", this._mean);
        this.eventuallyAddAttribute(normalDistributionXMLelement, "standardDeviation", this._standardDeviation);

        return normalDistributionXMLelement;

    }

}

export class LogNormalDistribution extends DistributionParameter {
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

    getType(): string {
        return "LogNormalDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let logNormalDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":LogNormalDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(logNormalDistributionXMLelement);
        this.eventuallyAddAttribute(logNormalDistributionXMLelement, "mean", this._mean);
        this.eventuallyAddAttribute(logNormalDistributionXMLelement, "standardDeviation", this._standardDeviation);

        return logNormalDistributionXMLelement;

    }
}

export class UniformDistribution extends DistributionParameter {
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

    getType(): string {
        return "UniformDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let uniformDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":UniformDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(uniformDistributionXMLelement);
        this.eventuallyAddAttribute(uniformDistributionXMLelement, "min", this._min);
        this.eventuallyAddAttribute(uniformDistributionXMLelement, "max", this._max);

        return uniformDistributionXMLelement;

    }
}

export class TriangularDistribution extends DistributionParameter {
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

    getType(): string {
        return "TriangularDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let triangularDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":TriangularDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(triangularDistributionXMLelement);
        this.eventuallyAddAttribute(triangularDistributionXMLelement, "min", this._min);
        this.eventuallyAddAttribute(triangularDistributionXMLelement, "max", this._max);
        this.eventuallyAddAttribute(triangularDistributionXMLelement, "mode", this._mode);

        return triangularDistributionXMLelement;

    }

}

export class TruncatedNormalDistribution extends DistributionParameter {
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

    getType(): string {
        return "TruncatedNormalDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let truncatedNormalDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":TruncatedNormalDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(truncatedNormalDistributionXMLelement);
        this.eventuallyAddAttribute(truncatedNormalDistributionXMLelement, "mean", this._mean);
        this.eventuallyAddAttribute(truncatedNormalDistributionXMLelement, "standardDeviation", this._standardDeviation);
        this.eventuallyAddAttribute(truncatedNormalDistributionXMLelement, "min", this._min);
        this.eventuallyAddAttribute(truncatedNormalDistributionXMLelement, "max", this._max);

        return truncatedNormalDistributionXMLelement;

    }
}

export class PoissonDistribution extends DistributionParameter {
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

    getType(): string {
        return "PoissonDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let poissonDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":PoissonDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(poissonDistributionXMLelement);
        this.eventuallyAddAttribute(poissonDistributionXMLelement, "mean", this._mean);

        return poissonDistributionXMLelement;

    }
}

export class NegativeExponentialDistribution extends DistributionParameter {
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

    getType(): string {
        return "NegativeExponentialDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let negativeExponentialDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":NegativeExponentialDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(negativeExponentialDistributionXMLelement);
        this.eventuallyAddAttribute(negativeExponentialDistributionXMLelement, "mean", this._mean);

        return negativeExponentialDistributionXMLelement;

    }
}

export class ErlangDistribution extends DistributionParameter {
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

    getType(): string {
        return "ErlangDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let erlangDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":ErlangDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(erlangDistributionXMLelement);
        this.eventuallyAddAttribute(erlangDistributionXMLelement, "mean", this._mean);
        this.eventuallyAddAttribute(erlangDistributionXMLelement, "k", this._k);


        return erlangDistributionXMLelement;

    }
}

export class GammaDistribution extends DistributionParameter {
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

    getType(): string {
        return "GammaDistribution"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let gammaDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":GammaDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(gammaDistributionXMLelement);
        this.eventuallyAddAttribute(gammaDistributionXMLelement, "shape", this._shape);
        this.eventuallyAddAttribute(gammaDistributionXMLelement, "scale", this._scale);

        return gammaDistributionXMLelement;

    }


}

export class UserDistribution extends DistributionParameter {
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

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let userDistributionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":UserDistribution");

        this.addTimeUnitToSuperClassAttributesToXMLElement(userDistributionXMLelement);
        for (let i = 0; i < this._points.length; i++) {
            userDistributionXMLelement.appendChild(this._points[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri));
        }
        this.eventuallyAddAttribute(userDistributionXMLelement, "discrete", this._discrete);

        return userDistributionXMLelement;

    }
    getType(): string {
        return "UserDistribution"
    }
}

export class UserDistributionDataPoint {
    private _probability: number;
    private _value: ParameterValue[] = [];

    constructor() {
    }

    get probability(): number {
        return this._probability;
    }

    set probability(value: number) {
        this._probability = value;
    }

    get value(): ParameterValue[] {
        return this._value;
    }

    set value(value: ParameterValue[]) {
        for (let i = 0; i < value.length; i++) {
            this._value.push(value[i]);
        }
    }

    eventuallyAddAttribute(elementXML: any, name: string, value: any) {
        if (value != undefined) {
            elementXML.setAttribute(name, value);
        }
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let userDistributionDataPointXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":UserDistributionDataPoint");


        // this.addSuperClassAttributesToXMLElement(userDistributionDataPointXMLelement);
        this.eventuallyAddAttribute(userDistributionDataPointXMLelement, "probability", this._probability);
        
        for(let i = 0; i < this._value.length; i++){
            userDistributionDataPointXMLelement.appendChild(this._value[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri));
        }

        return userDistributionDataPointXMLelement;

    }
}