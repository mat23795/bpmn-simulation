export class ScenarioParameter {
    private _temp: string;
    constructor(temp: string = "prova"){

    }

    get temp(): string {
        return this._temp;
    }

    set temp(value: string) {
        this._temp = value;
    }
}