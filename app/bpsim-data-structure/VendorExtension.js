class VendorExtension {
    constructor(name = "BPSim Vendor", value = "Caputo & Lazazzera"){
        this._name = name;
        this._value = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
}