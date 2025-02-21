import {EGameHand, EGameState} from "../models/EStates.js";
import {Player} from "../models/Player.js";

export default class GameService {

    private readonly MAX_HANDS : number = Object.keys(EGameHand).length;
    private _playerOne : Player;

    public constructor(playerOne : Player ) {
        this._playerOne = playerOne;

    }

    private PlayerGameOutcome(playerHand : EGameHand, PCHand : EGameHand) : EGameState {

        // check for draw.
        if (playerHand === PCHand) return EGameState.Draw;

        if (playerHand === EGameHand.Rock) {

            switch (PCHand) {
                case EGameHand.Scissors:
                    return EGameState.Won;
                case EGameHand.Paper:
                    return EGameState.Lost;
            }
        }

        else if (playerHand === EGameHand.Paper) {
            switch (PCHand) {
                case EGameHand.Rock:
                    return EGameState.Won;
                case EGameHand.Scissors:
                    return EGameState.Lost;
            }
        }
        else if (playerHand === EGameHand.Scissors) {
            switch (PCHand) {

                case EGameHand.Paper:
                    return EGameState.Won;
                case EGameHand.Rock:
                    return EGameState.Lost;
            }
        }




    }

    public static generateRandomInRange(min, max) : number {
        return Math.floor(min + Math.random()*(max - min + 1))
    }

    private getRandomGameHand(): EGameHand {
        const handIndex: number = GameService.generateRandomInRange(0, this.MAX_HANDS - 1);
        return Object.values(EGameHand)[handIndex] as EGameHand;
    }

    public PlayGame(playerHand : EGameHand, res) {

        const pcHand : EGameHand = this.getRandomGameHand()
        const outcome : EGameState = this.PlayerGameOutcome(playerHand, pcHand);

        if (outcome === EGameState.Draw) {
            this._playerOne.draws += 1;
            return res.status(200).send({message: `Player ${this._playerOne.name} draw`});
        } else if (outcome === EGameState.Lost ){
            this._playerOne.losses += 1;
            return res.status(200).send({message: `Player ${this._playerOne.name} lost`});
        } else if (outcome === EGameState.Won) {
            this._playerOne.wins += 1;
            return res.status(200).send({message: `Player ${this._playerOne.name} won`});
        }

    }

    public static parsePlayerHand(hand: string): EGameHand | undefined {
        const normalizedHand = hand.toLowerCase();
        return Object.values(EGameHand).includes(normalizedHand as EGameHand)
            ? (normalizedHand as EGameHand)
            : undefined;
    }

}