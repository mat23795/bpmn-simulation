var ScenarioParameter = (function () {
    function ScenarioParameter(temp) {
        if (temp === void 0) { temp = "prova"; }
    }
    Object.defineProperty(ScenarioParameter.prototype, "temp", {
        get: function () {
            return this._temp;
        },
        set: function (value) {
            this._temp = value;
        },
        enumerable: true,
        configurable: true
    });
    return ScenarioParameter;
})();
exports.ScenarioParameter = ScenarioParameter;
//# sourceMappingURL=ScenarioParameter.js.map