import {Player} from "../models/Player.js";
import {EGameStatus} from "../models/EStates.js";
import GameService from "../Infrastructure/GameService.js";

export class GameEndpoints {

    private _player : Player;
    private _gameStatus : EGameStatus = EGameStatus.Ready;
    private _gameService : GameService;


    public registerPlayer(req, res){

        if (!req.params.name) return res.status(400).send("Please provide a name")
        const name = req.params.name;

        if (this._gameStatus === EGameStatus.InProgress) {
            return res.status(400).send({message: 'Game is in progress, please end it first: /api/stop'});
        }

        this._player = new Player(name)
        this._gameService = new GameService(this._player);
        this._gameStatus = EGameStatus.InProgress
        return res.status(200).send({message: `Player registered with name ${this._player.name}`});
    }

    public playGame(req, res){

        // Validating user input.
        if (!req.params.hand) return res.status(400).send("Please provide a hand, Rock, Paper or Scissors")

        if (this._gameStatus === EGameStatus.Ended || this._gameStatus === EGameStatus.Ready ) {
            return res.status(400).send({message: 'Game is not in progress, please register player first: /api/register/:name'});
        }

        const hand = req.params.hand;

        // Converting hand into enum type.
        const parsedHand = GameService.parsePlayerHand(hand);
        if (!parsedHand) {
            return res.status(400).send({message: 'Invalid hand, please use Rock, Paper or Scissors'});
        }

        return this._gameService.PlayGame(parsedHand, res);

    }

    public endGame(req, res){

        if (this._gameStatus !== EGameStatus.InProgress) {
            return res.status(400).send({message: 'Game is not in progress, please register player first: /api/register/:name'});
        }

        this._gameStatus = EGameStatus.Ended;
        return res.status(200).send({message: 'Game ended for ' + this._player.name + ' with results Wins : ' + this._player.wins + '  LOSSES : ' + this._player.losses + ' DRAWS : ' + this._player.draws});
    }



}