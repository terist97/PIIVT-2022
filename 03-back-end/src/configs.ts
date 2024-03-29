import IConfig from "./common/IConfiginterface";
import CategoryRouter from './components/category/CategoryRouter.router';
import AdministratorRouter from './components/administrator/AdministratorRouter.router';
import { MailConfigurationParameters } from "./config.mail";
import AuthRouter from './components/auth/AuthRouter.router';
import { readFileSync } from "fs";
import OrderRouter from "./components/order/OrderRouter.router";

const DevConfig: IConfig = {
    server: {
        port: 10000,
        static: {
            index: false,
            dotfiles: "deny",
            cacheControl: true,
            etag: true,
            maxAge: 1000 * 60 * 60 * 24,
            path: "./static",
            route: "/assets"
        }
    },
    logging: {
        logPath: "./logs",
        fileName: "access.log",
        format: ":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-lenght] bytes\t:response-time ms",
    },
    database: {
        host: "localhost",
        port: 3306,
        user: "aplikacija",
        password: "aplikacija",
        database: "piivt_app",
        charset: "utf8",
        timezone: "+01:00",
        supportBigNumbers: true,
    },

    mail: {
        host: "smtp.office365.com",
        port: 587,
        email: "",
        password: "",
        debug: true,
    },
    auth: {
        administrator: {
            algorithm: "RS256",
            issuer: "PIiVT",
            tokens: {
                auth: {
                    duration: 60 * 60 * 60,
                    // trebalo bi da traje par minuta
                    keys: {
                        public: readFileSync("./.keystore/app.public", "ascii"),
                        private: readFileSync("./.keystore/app.private", "ascii"),
                    },
                },
                refresh: {
                    duration: 60 * 60 * 24 * 60,
                    // trebalo bi da traje recimo mesec dana
                    keys: {
                        public: readFileSync("./.keystore/app.public", "ascii"),
                        private: readFileSync("./.keystore/app.private", "ascii"),
                    },

                },



            },




        }

    },
    routers: [
        new CategoryRouter(),
        new AdministratorRouter(),
        new AuthRouter(),
        new OrderRouter(),
    ],
    fileUploads: {
        maxFiles: 1,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        temporaryFileDirectory: "../temp/",
        destinationDirectoryRoot: "uploads/",
        photos: {
            allowedTypes: ["png", "jpg"],
            allowedExtensions: [".png", ".jpg"],
            width: {
                min: 320,
                max: 1920,
            },
            height: {
                min: 240,
                max: 1080,
            },
            resize: [
                {
                    prefix: "small-",
                    width: 320,
                    height: 240,
                    fit: "cover",
                    defaultBackground: {
                        r: 0, g: 0, b: 0, alpha: 1,
                    }

                },
                {
                    prefix: "medium-",
                    width: 640,
                    height: 480,
                    fit: "cover",
                    defaultBackground: {
                        r: 0, g: 0, b: 0, alpha: 1,
                    }

                },

            ]

        },
    }
};



DevConfig.mail = MailConfigurationParameters;

export default DevConfig;