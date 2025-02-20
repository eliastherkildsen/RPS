import {IUser} from "../models/User";
import ITokenProvider from "../InterfaceAdapters/ITokenProvider";

export class UserAuthenticator {

    private users: Map<string, IUser> = new Map<string, IUser>();
    private readonly loginTokenProvider : ITokenProvider;
    private readonly refreshTokenProvider : ITokenProvider;

    constructor(login_token_provider : ITokenProvider, refresh_token_provider : ITokenProvider) {
        this.loginTokenProvider = login_token_provider;
        this.refreshTokenProvider = refresh_token_provider;
    }


    public login(req, res) {
        try {
            const user: IUser = req.body as IUser;

            // Reuse validation helper
            const validationError = UserAuthenticator.validateUserInput(user);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }

            if (!this.authenticateUser(user)) {
                return res.status(401).json({ message: "Invalid user" });
            }

            const loginToken = this.loginTokenProvider.generateToken(user);
            const refreshToken = this.refreshTokenProvider.generateToken(user);

            return res.status(201).json({
                message: "Login success",
                token: loginToken,
                refreshToken: refreshToken
            });
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public register(req: any, res: any) {
        try {
            const user: IUser = req.body as IUser;

            // Reuse validation helper
            const validationError = UserAuthenticator.validateUserInput(user);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }

            if (this.doesUserExist(user)) {
                return res.status(409).json({ message: "User already exists" });
            }

            this.users.set(user.username, user);
            return res.status(201).json({
                message: "User created successfully",
                user: user
            });
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    private static validateUserInput(user: IUser): string | null {
        if (!user || !user.username) {
            return "Malformed user attributes, username is missing";
        }
        if (!user.password) {
            return "Malformed user attributes, password is missing";
        }
        return null;
    }

    private doesUserExist(user: IUser): boolean {
        return this.users.has(user.username);
    }

    private authenticateUser(user: IUser): boolean {
        const userFound = this.users.get(user.username);
        if (!userFound) {
            return false;
        }
        return userFound.password === user.password;
    }
}