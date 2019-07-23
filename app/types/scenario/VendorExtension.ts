export class VendorExtension {
    
    private _name: string;
    private _value: any;

    constructor(){}

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }

    getType(): string{
        return "VendorExtension"
    }

    private eventuallyAddAttribute(elementXML: any, name: string, value:any){
        if(value != undefined){
            elementXML.setAttribute(name, value);
        }
    }    

    
    toXMLelement(bpsimPrefix: string, bpsimNamespaceUri: string): any {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(undefined, "text/xml");

        let vendorExtensionXMLelement = xmlDoc.createElementNS(bpsimNamespaceUri, bpsimPrefix+":VendorExtension");

        this.eventuallyAddAttribute(vendorExtensionXMLelement, "name", this._name);
        //TODO gestire il valore value opportunamente perché da specifiche è incomprensibile
        this.eventuallyAddAttribute(vendorExtensionXMLelement, "value", this._value);
        
        return vendorExtensionXMLelement;
    }
}