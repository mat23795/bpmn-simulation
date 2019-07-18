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
    private _propertyParameters: PropertyParameters[] = []; //da traccia non è un array, ma per esigenze lo diventa (no side effects)
    private _priorityParameters: PriorityParameters;

    constructor(){}

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
        for (let i = 0; i < value.length; i++) {
            this._vendorExtensions.push(value[i]);
        }
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

    get propertyParameters(): PropertyParameters [] {
        return this._propertyParameters;
    }

    set propertyParameters(value: PropertyParameters[]) {
        this._propertyParameters = value;
    }

    get priorityParameters(): PriorityParameters {
        return this._priorityParameters;
    }

    set priorityParameters(value: PriorityParameters) {
        this._priorityParameters = value;
    }

    private eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }

    getType(): string{
        return "ElementParameters"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let elementParametersXMLelement = xmlDoc.createElementNS(bpsimPrefix, "ElementParameters");

        this.eventuallyAddAttribute(elementParametersXMLelement, "id", this._id);
        this.eventuallyAddAttribute(elementParametersXMLelement, "elementRef", this._elementRef);

        for(let i=0; i< this._vendorExtensions.length; i++) {
            elementParametersXMLelement.appendChild(this._vendorExtensions[i].toXMLelement(bpsimPrefix, xml));
        }

        if(this._timeParameters != undefined){
            elementParametersXMLelement.appendChild(this._timeParameters.toXMLelement(bpsimPrefix, xml));
        }

        if(this._controlParameters != undefined){
            elementParametersXMLelement.appendChild(this._controlParameters.toXMLelement(bpsimPrefix, xml));
        }

        if(this._costParameters != undefined){
            elementParametersXMLelement.appendChild(this._costParameters.toXMLelement(bpsimPrefix, xml));
        }

        if(this._resourceParameters != undefined){
            elementParametersXMLelement.appendChild(this._resourceParameters.toXMLelement(bpsimPrefix, xml));
        }

        // console.log("prima");
        for(let i=0; i< this._propertyParameters.length; i++) {
        // if(this._propertyParameters != undefined){
            // console.log(this);
            elementParametersXMLelement.appendChild(this._propertyParameters[i].toXMLelement(bpsimPrefix, xml));
        }
        // console.log("dopo");

        if(this._priorityParameters != undefined){
            elementParametersXMLelement.appendChild(this._priorityParameters.toXMLelement(bpsimPrefix, xml));
        }

        return elementParametersXMLelement;
    }
}