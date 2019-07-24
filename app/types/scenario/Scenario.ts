import {VendorExtension} from "./VendorExtension";
import {ScenarioParameters} from "./ScenarioParameters";
import {ElementParameters} from "../parameters/ElementParameters";
import {DateTime} from "../parameter_type/ConstantParameter";
import {Calendar} from "../calendar/Calendar";


export class Scenario {
    private _id: string;
    private _name: string;
    private _description: string;
    private _created: DateTime;
    private _modified: DateTime;
    private _author: string;
    private _vendor: string = "Caputo & Lazazzera";
    private _version: string;
    private _result: string;
    private _inherits: string;
    private _elementParameters: ElementParameters[] = [];
    private _scenarioParameters: ScenarioParameters = new ScenarioParameters();
    private _vendorExtensions: VendorExtension[] = [];
    private _calendar : Calendar[] = [];

    constructor(){}

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get created(): DateTime {
        return this._created;
    }

    set created(value: DateTime) {
        this._created = value;
    }

    get modified(): DateTime {
        return this._modified;
    }

    set modified(value: DateTime) {
        this._modified = value;
    }

    get author(): string {
        return this._author;
    }

    set author(value: string) {
        this._author = value;
    }

    get vendor(): string {
        return this._vendor;
    }

    set vendor(value: string) {
        this._vendor = value;
    }

    get version(): string {
        return this._version;
    }

    set version(value: string) {
        this._version = value;
    }

    get result(): string {
        return this._result;
    }

    set result(value: string) {
        this._result = value;
    }

    get inherits(): string {
        return this._inherits;
    }

    set inherits(value: string) {
        this._inherits = value;
    }

    get elementParameters(): ElementParameters[] {
        return this._elementParameters;
    }

    set elementParameters(value: ElementParameters[]) {
        for(let i=0; i<value.length; i++) {
            this._elementParameters.push(value[i]);
        }
    }

    get scenarioParameters(): ScenarioParameters {
        return this._scenarioParameters;
    }

    set scenarioParameters(value: ScenarioParameters) {
        this._scenarioParameters = value;
    }

    get vendorExtensions(): VendorExtension[] {
        return this._vendorExtensions;
    }

    set vendorExtensions(value: VendorExtension[]) {
        for (let i = 0; i < value.length; i++) {
            this._vendorExtensions.push(value[i]);
        }
    }

    get calendar(): Calendar[] {
        return this._calendar;
    }

    set calendar(value: Calendar[]) {
        for (let i = 0; i < value.length; i++) {
            this._calendar.push(value[i]);
        }
    }

    private eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }

    getType(): string{
        return "Scenario"
    }

    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any{

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let scenarioXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":Scenario");

        this.eventuallyAddAttribute(scenarioXMLelement, "id", this._id);
        this.eventuallyAddAttribute(scenarioXMLelement, "name", this._name);
        this.eventuallyAddAttribute(scenarioXMLelement, "description", this._description);
        this.eventuallyAddAttribute(scenarioXMLelement, "created", this._created);
        this.eventuallyAddAttribute(scenarioXMLelement, "modified", this._modified);
        this.eventuallyAddAttribute(scenarioXMLelement, "author", this._author);
        this.eventuallyAddAttribute(scenarioXMLelement, "vendor", this._vendor);
        this.eventuallyAddAttribute(scenarioXMLelement, "version", this._version);
        this.eventuallyAddAttribute(scenarioXMLelement, "result", this._result);
        this.eventuallyAddAttribute(scenarioXMLelement, "inherits", this._inherits);

        if(this._scenarioParameters != undefined){
            scenarioXMLelement.appendChild(this._scenarioParameters.toXMLelement(bpsimPrefix, bpsimNamespaceUri));
        }

        for(let i=0; i< this._elementParameters.length; i++) {
            scenarioXMLelement.appendChild(this._elementParameters[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri));
        }

        for(let i=0; i< this._vendorExtensions.length; i++) {
            scenarioXMLelement.appendChild(this._vendorExtensions[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri));
        }

        for(let i=0; i< this._calendar.length; i++) {
            scenarioXMLelement.appendChild(this._calendar[i].toXMLelement(bpsimPrefix, bpsimNamespaceUri));
        }

        return scenarioXMLelement;
    }

}