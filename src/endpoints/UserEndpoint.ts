import {IUser} from "../models/User";
import ITokenProvider from "../InterfaceAdapters/ITokenProvider";

export class UserEndpoint {

    private static users : Map<string, IUser> = new Map<string, IUser>


    public static login(req, res, LoginTokenProvider : ITokenProvider, RefreshTokenProvider : ITokenProvider) {

        try {
            const user : IUser = req.body as IUser

            if (!user || !user.username) {
                return res.status(400).json(
                    {message: "Malformed user attributes, username or password missing"});
            }

            else if (!user.password) {
                return res.status(400).json(
                    {message: "Malformed user attributes password missing"});
            }

            // Validating the user
            const isValid = UserEndpoint.authenticateUser(user);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid user" });
            }

            // Creating credentials for the user.
            const LoginToken = LoginTokenProvider.generateToken(user);
            const RefreshToken = RefreshTokenProvider.generateToken(user);

            return res.status(201).json({
                "massage" : "Login success",
                "token" : LoginToken,
                "refreshToken" : RefreshToken
            })
        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public static register(req: any, res : any) {

        try {
            const user : IUser = req.body as IUser
            if (!user || !user.username || !user.password) {
                return res.status(400).json({ message: "Malformed user attributes" });
            }

            if (UserEndpoint.isUserExist(user)) {
                return res.status(409).json(
                    {
                        "message": "User already exist"
                    }
                )
            }

            UserEndpoint.users.set(user.username, user);
            return res.status(201).json({
                "massage" : "User created",
                "user" : user
            })


        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }

    }

    private static isUserValid(req) : boolean {

        const user : IUser = req.body as IUser
        if (!user || !user.username || !user.password) {
            return false;
        }
        
        return true;

    }

    private static isUserExist(user : IUser) : boolean {
        return UserEndpoint.users.has(user.username);
    }

    private static authenticateUser(user : IUser) : boolean {

        const userFound = UserEndpoint.users.get(user.username);
        if (!userFound) {
            return false;
        }

        return userFound.password == user.password && userFound.username == user.username;

    }



}