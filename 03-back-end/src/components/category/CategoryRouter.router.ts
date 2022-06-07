import CategoryController from "./CategoryController.controler";
import CategoryService from "./CategoryService.service";
import * as express from "express";
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import ItemController from '../item/ItemController.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';


class CategoryRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources){
       
        const categoryController: CategoryController = new CategoryController(resources.services);
        const itemController:ItemController=new ItemController(resources.services);
        
        application.get("/api/category",categoryController.getAll.bind(categoryController));
        // application.get("/api/category",       AuthMiddleware.getVerifier("administrator"),   categoryController.getAll.bind(categoryController));
        application.get("/api/category/:id", categoryController.getById.bind(categoryController));
        application.get("/api/category/:cid/item", itemController.getAllItemsByCategoryId.bind(itemController));
        application.post("/api/category/:cid/item", itemController.add.bind(itemController)); 
        application.get("/api/category/:cid/item/:iid", itemController.getItemById.bind(itemController));
        application.post("/api/category", categoryController.add.bind(categoryController));
        application.put("/api/category/:cid", categoryController.edit.bind(categoryController));
        //application.put("/api/category/:cid/item/:iid",     itemController.edit.bind(itemController));
       application.post("/api/category/:cid/photo", categoryController.uploadPhoto.bind(categoryController));
       application.post("/api/category/:cid/item/:iid/photo", itemController.uploadPhoto.bind(itemController));
    }
}
export default CategoryRouter;

