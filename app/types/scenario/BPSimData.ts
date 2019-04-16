import {Scenario} from "./Scenario";

export class BPSimData{
    private _scenario : Scenario[] = [];

    constructor(){}


    get scenario() : Scenario[] {
        return this._scenario;
    }

    set scenario(scenario: Scenario[]){
        for(let i=0; i<scenario.length; i++) {
            this._scenario.push(scenario[i]);
        }

    }

    addScenario(scenario: Scenario){
        this._scenario.push(scenario);
    }
}