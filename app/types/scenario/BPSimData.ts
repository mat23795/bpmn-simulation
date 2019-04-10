import {Scenario} from "./Scenario";

export class BPSimData{
    private _scenarios : Scenario[] = [];

    constructor(){}


    get scenarios() : Scenario[] {
        return this._scenarios;
    }

    set scenarios(scenarios: Scenario[]){
        this._scenarios = scenarios
    }

    addScenario(scenario: Scenario){
        this._scenarios.push(scenario);
    }
}