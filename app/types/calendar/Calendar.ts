export class Calendar{
    
    private _id: string;
    private _name: string;
    private _calendar: any;

    constructor(){}

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get calendar(): any {
        return this._calendar;
    }

    set calendar(value: any) {
        this._calendar = value;
    }

    private eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }    


    toXMLelement(bpsimPrefix: string, xml: any): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let calendarXMLelement = xmlDoc.createElement(bpsimPrefix + ":Calendar");
        // TODO FINIRLA
        this.eventuallyAddAttribute(calendarXMLelement, "id", this._id);
        this.eventuallyAddAttribute(calendarXMLelement, "name", this._name);



        return calendarXMLelement;
    }
}