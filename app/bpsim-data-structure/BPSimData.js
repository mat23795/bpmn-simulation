class BPSimData {
    scenarios = new Array();

    constructor(scenarios) {
        this._scenarios.concat(scenarios);
    }

    get scenarios() {
        return this._scenarios;
    }

    set scenarios(value) {
        this._scenarios = value;
    }
}