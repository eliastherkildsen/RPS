import {EGameHand, EGameState} from "../models/EStates";

export default class GameEndpoint {

    private _games : Map<number, EGameState>;

    public constructor() {
        this._games = new Map<number, EGameState>();
    }

    private DidPlayerWin(playerHand : EGameHand, PCHand : EGameHand) : boolean {
        return true;
    }

    private generateRandomInteger(min, max) : number {
        return Math.floor(min + Math.random()*(max - min + 1))
    }

    private _PCPlayHand() {
        const hand : number = this.generateRandomInteger(0, 2);
        return EGameHand[hand];
    }

    public PlayerPlayHand(req, res) {

        try {



        } catch (err) {

        }

    }

}