var BPSimData = (function () {
    function BPSimData(scenarios) {
        this._scenarios.concat(scenarios);
    }
    Object.defineProperty(BPSimData.prototype, "scenarios", {
        get: function () {
            return this._scenarios;
        },
        enumerable: true,
        configurable: true
    });
    BPSimData.prototype.addScenario = function (scenario) {
        this._scenarios.push(scenario);
    };
    return BPSimData;
})();
exports.BPSimData = BPSimData;
//# sourceMappingURL=BPSimData.js.map