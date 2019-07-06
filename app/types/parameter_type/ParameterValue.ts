import {ResultType} from "./ResultType";
import {Calendar} from "../calendar/Calendar";
import {DateTime} from "./ConstantParameter";

export class ParameterValue{
    protected _validFor: Calendar;
    protected _instance: string;
    protected _result: ResultType;
    protected _resultTimeStamp: DateTime;

    constructor(){};


    get validFor(): Calendar {
        return this._validFor;
    }

    set validFor(value: Calendar) {
        this._validFor = value;
    }

    get instance(): string {
        return this._instance;
    }

    set instance(value: string) {
        this._instance = value;
    }

    get result(): ResultType {
        return this._result;
    }

    set result(value: ResultType) {
        this._result = value;
    }

    get resultTimeStamp(): DateTime {
        return this._resultTimeStamp;
    }

    set resultTimeStamp(value: DateTime) {
        this._resultTimeStamp = value;
    }

    getType(): string{
        return "ParameterValue"
    }

    protected eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }

    // * Aggiunge automaticamente, se chiamata, i 4 attributi a tutte le sue sottoclassi
    protected addSuperClassAttributesToXMLElement(elementXML: any){
        this.eventuallyAddAttribute(elementXML, "validFor", this.validFor);
        this.eventuallyAddAttribute(elementXML, "instance", this._instance);
        this.eventuallyAddAttribute(elementXML, "result", this._result);
        this.eventuallyAddAttribute(elementXML, "resultTimeStamp", this._resultTimeStamp);
        // console.log("sono nella funzione figlia di tutti i parameteValue"); //TODO remove
    }

    // toXMLelement(element: any): any {
    toXMLelement(bpsimPrefix: string, xml: any): any {
        // TODO
        console.log("sono in ParameterValue"); //TODO REMOVE

        //TODO chiamare addSuper... anche qui, dopo aver scritto toxml di tutti i suoi figli

    }

}
