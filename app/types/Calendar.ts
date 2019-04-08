export class Calendar{
    private _id: string;
    private _name: string;
    private _calendar: Object;

    constructor(id: string, name: string, calendar: Object) {
        this._id = id;
        this._name = name;
        this._calendar = calendar;
    }


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

    get calendar(): Object {
        return this._calendar;
    }

    set calendar(value: Object) {
        this._calendar = value;
    }
}