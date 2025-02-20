import ITokenProvider from "../../InterfaceAdapters/ITokenProvider.js";
import {BearerTokenSigningService} from "./BearerTokenSigningService.js";

export enum EProviders {
    "berarer_token",
}

interface ITokenProviderFactory {
    provider: EProviders;
    secretKey?: string;
    issuer?: string;
    audience?: string;
    expiresIn?: number;
}

export default class TokenProviderFactory {

    public static CreateFactory(configuration: ITokenProviderFactory) : ITokenProvider {

        if (configuration.provider == EProviders.berarer_token) {

            if (!configuration.issuer) {
                throw new Error("Issuer has not been defined. please pass the issuer in the constructor.")
            }

            if (!configuration.audience) {
                throw new Error("Audience has not been defined. please pass the audience in the constructor.")
            }

            if (!configuration.secretKey) {
                throw new Error("Secret key has not been defined. please pass the secret key in the constructor.")
            }

            if (!configuration.expiresIn) {
                throw new Error("Expires in has not been defined. please pass the expires in in the constructor.")
            }

            return new BearerTokenSigningService(configuration.secretKey, configuration.expiresIn,
                "HS256", configuration.issuer, configuration.audience)
        }



        // fail safe...
        throw new Error(`Provider ${configuration.provider} is not supported.`);

    }

}