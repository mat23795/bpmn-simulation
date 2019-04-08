var Scenario = (function () {
    function Scenario(id, name, description, created, modified, author, vendor, version, result, inherits, scenarioParameters, vendorExtension, elementParameters) {
        if (vendor === void 0) { vendor = "Caputo & Lazazzera"; }
        if (version === void 0) { version = "1.0"; }
        if (result === void 0) { result = null; }
        if (inherits === void 0) { inherits = null; }
        if (scenarioParameters === void 0) { scenarioParameters = null; }
        if (vendorExtension === void 0) { vendorExtension = null; }
        if (elementParameters === void 0) { elementParameters = null; }
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
        this._vendorExtension = vendorExtension;
    }
    Object.defineProperty(Scenario.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (value) {
            this._description = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "created", {
        get: function () {
            return this._created;
        },
        set: function (value) {
            this._created = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "modified", {
        get: function () {
            return this._modified;
        },
        set: function (value) {
            this._modified = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "author", {
        get: function () {
            return this._author;
        },
        set: function (value) {
            this._author = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "vendor", {
        get: function () {
            return this._vendor;
        },
        set: function (value) {
            this._vendor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "version", {
        get: function () {
            return this._version;
        },
        set: function (value) {
            this._version = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "result", {
        get: function () {
            return this._result;
        },
        set: function (value) {
            this._result = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "inherits", {
        get: function () {
            return this._inherits;
        },
        set: function (value) {
            this._inherits = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "elementParameters", {
        get: function () {
            return this._elementParameters;
        },
        set: function (value) {
            this._elementParameters = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "scenarioParameters", {
        get: function () {
            return this._scenarioParameters;
        },
        set: function (value) {
            this._scenarioParameters = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scenario.prototype, "vendorExtension", {
        get: function () {
            return this._vendorExtension;
        },
        set: function (value) {
            this._vendorExtension = value;
        },
        enumerable: true,
        configurable: true
    });
    return Scenario;
})();
exports.Scenario = Scenario;
//# sourceMappingURL=Scenario.js.map