import IRouter from "./IRouter.interface";
import { Algorithm } from "jsonwebtoken";

export interface IMailConfiguration {
    host: string,
    port:number,
    email:string,
    password: string,
    debug:boolean,
}

export interface ITokenProperties{
    duration:number,
    keys:{
        public:string,
        private:string,
    },
}

export interface IAuthTokenOptions{

    issuer: string,
    algorithm: Algorithm,
    tokens:{
        auth:ITokenProperties,
        refresh:ITokenProperties,
    },

}
interface IConfig {
    server:{
        port:number;
        static:{
            index: string | false;
            dotfiles: "allow" | "deny";
            cacheControl:boolean;
            etag: boolean;
            maxAge:number;
            route:string;
            path:string;
        }
    },
    logging:{
        logPath:string,
        fileName: string,
        format:string
    },
    database:{
        host:string,
        port:number,
        user:string,
        password:string,
        database:string,
        charset:'utf8' | 'utf8mb4' | 'ascii',
        timezone:string,
        supportBigNumbers:boolean,
    },
    routers: IRouter[],

    mail:IMailConfiguration,
    auth:{
        administrator: IAuthTokenOptions,
    },

}

export default IConfig;