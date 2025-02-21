import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from "express-fileupload";
import ITokenProvider from "../InterfaceAdapters/ITokenProvider";
import TokenProviderFactory, {EProviders} from "../Infrastructure/TokenService/TokenProviderFactory.js";
import morganMiddleware from "../Infrastructure/Logger/morganMiddleware.js";
import {UserAuthenticator} from "../endpoints/UserAuthenticator.js";
import {GameEndpoints} from "../endpoints/GameEndpoints.js";


dotenv.config({ path: 'config/middleware.env' });

const routes = express();
routes.use(cors());
routes.use(express.static('public'));
routes.use(fileUpload())
routes.use(morganMiddleware)
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json())

const LOGIN_TOKEN_EXPIRATION_TIME : number  = 3600; // 1 Hour
const LoginTokenProvider : ITokenProvider = TokenProviderFactory.CreateFactory({
    "provider": EProviders.berarer_token,
    "audience": process.env.AUDIENCE,
    "issuer": process.env.ISSUER,
    "secretKey": process.env.TOKEN_SECRET_KEY,
    "expiresIn": LOGIN_TOKEN_EXPIRATION_TIME
});

const REFRESH_TOKEN_EXPIRATION_TIME : number = 86400; // 1 Day
const RefreshTokenProvider : ITokenProvider = TokenProviderFactory.CreateFactory({
    "provider": EProviders.berarer_token,
    "audience": process.env.AUDIENCE,
    "issuer": process.env.ISSUER,
    "secretKey": process.env.TOKEN_SECRET_KEY,
    "expiresIn": REFRESH_TOKEN_EXPIRATION_TIME
});

const game = new GameEndpoints();

const authenticator = new UserAuthenticator(LoginTokenProvider, RefreshTokenProvider);

routes.post('/api/login', (req, res) => {
    return authenticator.login(req, res)
})

routes.post('/api/register', (req, res) => {
    return authenticator.register(req, res)
})

routes.get('/api/start/:name', (req, res) => {
    const name = req.params.name;
    return game.registerPlayer(name, res);
})

routes.get('/api/play/:hand', (req, res) => {
    const hand = req.params.hand;
    return game.playGame(hand, res);
})

routes.get('/api/stop', (req, res) => {
    return game.endGame(req ,res)
})

export {routes}