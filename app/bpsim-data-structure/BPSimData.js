class BPSimData{
    _scenarios = new Array();

    constructor(scenarios) {
        this._scenarios.push(scenarios);
    }

    get scenarios() {
        return this._scenarios;
    }

    set scenarios(value) {
        this._scenarios = value;
    }

    addScenario(scenario){
        this._scenarios.push(scenario);
    }
}