import IConfig from "./common/IConfiginterface";
import CategoryRouter from './components/category/CategoryRouter.router';
import AdministratorRouter from './components/administrator/AdministratorRouter.router';

const DevConfig: IConfig = {
    server: {
        port:10000,
        static:{
            index:false,
            dotfiles:"deny",
            cacheControl:true,
            etag:true,
            maxAge:1000* 60 * 60 * 24,
            path: "./static",
            route: "/assets"
        }
    },
    logging:{
        logPath:"./logs",
        fileName: "access.log",
        format:":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-lenght] bytes\t:response-time ms",
    },
    database:{
        host:"localhost",
        port:3306,
        user:"aplikacija",
        password:"aplikacija",
        database:"piivt_app",
        charset:"utf8",
        timezone:"+01:00",
        supportBigNumbers:true,
    },
    routers:[
        new CategoryRouter(),
        new AdministratorRouter,
    ]
   
    
};

export default DevConfig;