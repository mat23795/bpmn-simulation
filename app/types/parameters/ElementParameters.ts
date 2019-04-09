import {VendorExtension} from "../scenario/VendorExtension";
import {TimeParameters} from "./TimeParameters";
import {ControlParameters} from "./ControlParameters";
import {CostParameters} from "./CostParameters";
import {ResourceParameters} from "./ResourceParameters";
import {PropertyParameters} from "./PropertyParameters";
import {PriorityParameters} from "./PriorityParameters";

export class ElementParameters {
    private _id: string;
    private _elementRef: string;
    private _vendorExtensions: VendorExtension[] = [];
    private _timeParameters: TimeParameters;
    private _controlParameters: ControlParameters;
    private _costParameters: CostParameters;
    private _resourceParameters: ResourceParameters;
    private _propertyParameters: PropertyParameters;
    private _priorityParameters: PriorityParameters;

    constructor(id: string, elementRef: string, vendorExtensions: VendorExtension[], timeParameters: TimeParameters = null,
                controlParameters: ControlParameters = null, costParameters: CostParameters = null,
                resourceParameters: ResourceParameters = null, propertyParameters: PropertyParameters = null,
                priorityParameters: PriorityParameters = null) {
        this._id = id;
        this._elementRef = elementRef;
        this._vendorExtensions = vendorExtensions;
        this._timeParameters = timeParameters;
        this._controlParameters = controlParameters;
        this._costParameters = costParameters;
        this._resourceParameters = resourceParameters;
        this._propertyParameters = propertyParameters;
        this._priorityParameters = priorityParameters;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get elementRef(): string {
        return this._elementRef;
    }

    set elementRef(value: string) {
        this._elementRef = value;
    }

    get vendorExtensions(): VendorExtension[] {
        return this._vendorExtensions;
    }

    set vendorExtensions(value: VendorExtension[]) {
        this._vendorExtensions = value;
    }

    get timeParameters(): TimeParameters {
        return this._timeParameters;
    }

    set timeParameters(value: TimeParameters) {
        this._timeParameters = value;
    }

    get controlParameters(): ControlParameters {
        return this._controlParameters;
    }

    set controlParameters(value: ControlParameters) {
        this._controlParameters = value;
    }

    get costParameters(): CostParameters {
        return this._costParameters;
    }

    set costParameters(value: CostParameters) {
        this._costParameters = value;
    }

    get resourceParameters(): ResourceParameters {
        return this._resourceParameters;
    }

    set resourceParameters(value: ResourceParameters) {
        this._resourceParameters = value;
    }

    get propertyParameters(): PropertyParameters {
        return this._propertyParameters;
    }

    set propertyParameters(value: PropertyParameters) {
        this._propertyParameters = value;
    }

    get priorityParameters(): PriorityParameters {
        return this._priorityParameters;
    }

    set priorityParameters(value: PriorityParameters) {
        this._priorityParameters = value;
    }
}