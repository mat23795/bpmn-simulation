export class VendorExtension {
    private _name: string;
    private _value: Object;

    constructor(name: string = "BPSim Vendor", value: Object = "Caputo & Lazazzera"){
        this._name = name;
        this._value = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get value(): Object {
        return this._value;
    }

    set value(value: Object) {
        this._value = value;
    }
}