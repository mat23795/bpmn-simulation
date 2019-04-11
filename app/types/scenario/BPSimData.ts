import {Scenario} from "./Scenario";

export class BPSimData{
    private _scenarios : Scenario[] = [];

    constructor(){}


    get scenarios() : Scenario[] {
        return this._scenarios;
    }

    set scenarios(scenarios: Scenario[]){
        for(let i=0; i<scenarios.length; i++) {
            this._scenarios.push(scenarios[i]);
        }
    }

    addScenario(scenario: Scenario){
        this._scenarios.push(scenario);
    }
}