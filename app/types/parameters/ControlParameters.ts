import {Parameter} from "../parameter_type/Parameter";

export class ControlParameters{
    private _interTriggerTimer: Parameter;
    private _triggerCount: Parameter;
    private _probability: Parameter;
    private _condition: Parameter;

    constructor(){}


    get interTriggerTimer(): Parameter {
        return this._interTriggerTimer;
    }

    set interTriggerTimer(value: Parameter) {
        this._interTriggerTimer = value;
    }

    get triggerCount(): Parameter {
        return this._triggerCount;
    }

    set triggerCount(value: Parameter) {
        this._triggerCount = value;
    }

    get probability(): Parameter {
        return this._probability;
    }

    set probability(value: Parameter) {
        this._probability = value;
    }

    get condition(): Parameter {
        return this._condition;
    }

    set condition(value: Parameter) {
        this._condition = value;
    }

    getType(): string{
        return "ControlParameters"
    }

    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let controlParametersXMLelement = xmlDoc.createElement(bpsimPrefix +":ControlParameters");

        if(this._interTriggerTimer != undefined){
            controlParametersXMLelement.appendChild(this._interTriggerTimer.toXMLelement(bpsimPrefix, xml, "InterTriggerTime"));
        }

        if(this._triggerCount != undefined){
            controlParametersXMLelement.appendChild(this._triggerCount.toXMLelement(bpsimPrefix, xml, "TriggerCount"));
        }

        if(this._probability != undefined){
            controlParametersXMLelement.appendChild(this._probability.toXMLelement(bpsimPrefix, xml, "Probability"));
        }

        if(this._condition != undefined){
            controlParametersXMLelement.appendChild(this._condition.toXMLelement(bpsimPrefix, xml, "Condition"));
        }

        return controlParametersXMLelement;
    }

}