var ElementParameter = (function () {
    function ElementParameter(temp) {
        if (temp === void 0) { temp = "prova"; }
    }
    Object.defineProperty(ElementParameter.prototype, "temp", {
        get: function () {
            return this._temp;
        },
        set: function (value) {
            this._temp = value;
        },
        enumerable: true,
        configurable: true
    });
    return ElementParameter;
})();
exports.ElementParameter = ElementParameter;
//# sourceMappingURL=ElementParameter.js.map