import { NextFunction, Request, Response } from "express";
import IAdministratorTokenData from "../components/auth/dto/IAdministratorTokenData";
import * as jwt from "jsonwebtoken";
import DevConfig from "../configs";

export default class AuthMiddleware {

    public static getVerifier(allowedRoles: "administrator"): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.verifyAuthToken(req, res, next, allowedRoles);
        }
    }

    private static verifyAuthToken(req: Request, res: Response, next: NextFunction, allowedRoles: "administrator") {
        const tokenHeader: string = req.headers?.authorization ?? "";

        try {

            const checks = [];

            for (let role of allowedRoles) {
                try {
                    const check = this.validateTokenAs(tokenHeader, "administrator", "auth");
                    if (check) {
                        checks.push(check);
                    }
                } catch (error) {

                }
            }

            if (checks.length === 0) {
                throw {
                    status: 403,
                    message: "You are not authorised to acces this resource!",
                }

            }

            req.authorisation = checks[0];
            next();
        }

        catch (error) {
            res.status(error?.status ?? 500).send(error?.message);
        }

    }

    public static validateTokenAs(tokenString: string, role: "administrator", type: "auth" | "refresh"): IAdministratorTokenData {

        if (tokenString === "") {
            throw {
                status: 400,
                message: "No token specified!",
            }

        }

        const [tokenType, token] = tokenString.trim().split(" ");

        if (tokenType !== "Bearer") {

            throw {
                status: 401,
                message: "Invalid token type!",
            }

        }

        if (typeof token !== "string" || token.length === 0) {

            throw {
                status: 401,
                message: "Token not specified toket",
            }


        }
        try {
            const tokenVerification = jwt.verify(token, DevConfig.auth.administrator.tokens[type].keys.public);
            if (!tokenVerification) {

                throw {
                    status: 401,
                    message: "Invalid token specified!",
                }


            }
            const originalTokenData = tokenVerification as IAdministratorTokenData;
            const tokenData: IAdministratorTokenData = {
                id: originalTokenData.id,
                identity: originalTokenData.identity,
                role: "administrator"
            };


            return tokenData;
        }
        catch (error) {
            const message: string = (error?.message ?? "");
            if (message.includes("jwt expired")) {

                throw {
                    status: 401,
                    message: "This token has exired",
                };


            }

            throw {
                status: 500,
                message: error?.message,
            };

        }


    }



}