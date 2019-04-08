var VendorExtension = (function () {
    function VendorExtension(name, value) {
        if (name === void 0) { name = "BPSim Vendor"; }
        if (value === void 0) { value = "Caputo & Lazazzera"; }
        this._name = name;
        this._value = value;
    }
    Object.defineProperty(VendorExtension.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VendorExtension.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    return VendorExtension;
})();
exports.VendorExtension = VendorExtension;
//# sourceMappingURL=VendorExtension.js.map