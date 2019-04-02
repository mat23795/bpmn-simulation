class Scenario {

    constructor(id, name, description, created, modified, author, vendor, version){

        this._id = id;
        this._name = name;
        this._description = description;
        this._created = created;
        this._modified = modified;
        this._author = author;
        this._vendor = vendor;
        this._version = version;
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get created() {
        return this._created;
    }

    set created(value) {
        this._created = value;
    }

    get modified() {
        return this._modified;
    }

    set modified(value) {
        this._modified = value;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get vendor() {
        return this._vendor;
    }

    set vendor(value) {
        this._vendor = value;
    }

    get version() {
        return this._version;
    }

    set version(value) {
        this._version = value;
    }
}