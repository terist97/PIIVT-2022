import * as express from "express";
import * as cors from "cors";
import IConfig from "./common/IConfiginterface";
import DevConfig from './configs';
import CategoryController from './components/category/CategoryController.controler';
import CategoryService from './components/category/CategoryService.service';
import * as fs from "fs";
import * as morgan from "morgan";
import CategoryRouter from './components/category/CategoryRouter.router';
import IApplicationResources from './common/IApplicationResources.interface';
import * as mysql2 from 'mysql2/promise';
import AdministratorService from './components/administrator/AdministratorService.service';
import ItemService from "./components/item/ItemService.service";
import fileUpload = require("express-fileupload");




async function main(){
    const config: IConfig  = DevConfig;

fs.mkdirSync(config.logging.logPath, {
    mode:777,
    recursive: true,

});

const db= await mysql2.createConnection({
      
    host:config.database.host,
    port:config.database.port,
    user:config.database.user,
    password:config.database.password,
    database:config.database.database,
    charset:config.database.charset,
    timezone:config.database.timezone,
    supportBigNumbers:config.database.supportBigNumbers,
});

const applicationResources: IApplicationResources = {
    databaseConnection: db,
    services:{
        category:null,
        administrator:null,
        item:null,
    }
    
    
};

applicationResources.services.category= new CategoryService(applicationResources);
applicationResources.services.administrator=new AdministratorService(applicationResources);
applicationResources.services.item=new ItemService(applicationResources);
    


const application:express.Application = express();

application.use(morgan(config.logging.format, {
    stream: fs.createWriteStream(config.logging.logPath + "/" + config.logging.fileName, {flags: 'a'}),
}));




application.use(cors());

application.use(express.urlencoded({extended:true,}));
application.use(fileUpload({
    limits:{
        files:1,
        fileSize:1024*1024*5, //5mb
    },
    abortOnLimit:true,

    useTempFiles:true,
    tempFileDir:"../temp/",
    createParentPath:true,
    safeFileNames:true,
    preserveExtension:true,

}));



application.use(express.json());

application.use(config.server.static.route, express.static(config.server.static.path,
{
index:config.server.static.index,
dotfiles:config.server.static.dotfiles,
cacheControl:config.server.static.cacheControl,
etag:config.server.static.etag,
maxAge:config.server.static.maxAge
}));

for(const router of config.routers){
    router.setupRoutes(application,applicationResources);
}



application.use((req,res) => {
    res.sendStatus(404);
})

application.listen(config.server.port);
}
process.on('uncaughtException', error => {
    console.error('ERROR',error);
});

main();