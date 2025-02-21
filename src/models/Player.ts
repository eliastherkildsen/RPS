export class Player {

    private _name: string;
    private _wins: number = 0;
    private _losses: number = 0;
    private _draws: number = 0;

    constructor(name : string) {
        this._name = name;
    }

    get wins(): number {
        return this._wins;
    }

    set wins(value: number) {
        this._wins = value;
    }

    get losses(): number {
        return this._losses;
    }

    set losses(value: number) {
        this._losses = value;
    }

    get draws(): number {
        return this._draws;
    }

    set draws(value: number) {
        this._draws = value;
    }

    get name(): string {
        return this._name;
    }







}