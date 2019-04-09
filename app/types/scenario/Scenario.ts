import {DateTime} from "../DateTime";
import {VendorExtension} from "./VendorExtension";
import {ScenarioParameters} from "./ScenarioParameters";
import {ElementParameters} from "../parameters/ElementParameters";


export class Scenario {
    private _id: string;
    private _name: string;
    private _description: string;
    private _created: DateTime;
    private _modified: DateTime;
    private _author: string;
    private _vendor: string;
    private _version: string;
    private _result: Scenario;
    private _inherits: Scenario;
    private _elementParameters: ElementParameters[] = [];
    private _scenarioParameters: ScenarioParameters;
    private _vendorExtensions: VendorExtension[] = [];


    constructor(id: string, name: string, description: string, created: DateTime, modified: DateTime, author: string, vendor: string = "Caputo & Lazazzera", version: string = "1.0",
                result: Scenario = null, inherits: Scenario = null, scenarioParameters: ScenarioParameters = null, vendorExtension: VendorExtension[] = null, elementParameters: ElementParameters[] = null) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._created = created;
        this._modified = modified;
        this._author = author;
        this._vendor = vendor;
        this._version = version;
        this._result = result;
        this._inherits = inherits;
        this._elementParameters = elementParameters;
        this._scenarioParameters = scenarioParameters;
        this._vendorExtensions = vendorExtension;
    }

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

    get result(): Scenario {
        return this._result;
    }

    set result(value: Scenario) {
        this._result = value;
    }

    get inherits(): Scenario {
        return this._inherits;
    }

    set inherits(value: Scenario) {
        this._inherits = value;
    }

    get elementParameters(): ElementParameters[] {
        return this._elementParameters;
    }

    set elementParameters(value: ElementParameters[]) {
        this._elementParameters = value;
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
        this._vendorExtensions = value;
    }
}