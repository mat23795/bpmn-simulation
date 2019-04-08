import {Scenario} from "./Scenario";

export class BPSimData{
    private _scenarios : Scenario[];

    constructor(scenarios: Scenario[]) {
        this._scenarios.concat(scenarios);
    }

    get scenarios() : Scenario[] {
        return this._scenarios;
    }

    addScenario(scenario: Scenario){
        this._scenarios.push(scenario);
    }
}