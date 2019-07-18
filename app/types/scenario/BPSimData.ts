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

    getType(): string{
        return "BPSimData"
    }

    addScenario(scenario: Scenario){
        this._scenario.push(scenario);
    }

    toXMLelement(bpsimPrefix: string, xml: any){

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
        
        let bpsimDataXMLelement = xmlDoc.createElementNS(bpsimPrefix,"BPSimData");
        
        for(let i=0; i< this._scenario.length; i++) {
            bpsimDataXMLelement.appendChild(this._scenario[i].toXMLelement(bpsimPrefix,xml));
        }

        return bpsimDataXMLelement;
    }
}