import * as express from "express";
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import OrderController from "./OrderController.controller";

class OrderRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const orderController: OrderController = new OrderController(resources.services);

        application.get("/api/order", orderController.getAll.bind(orderController));
        application.get("/api/order/:id", orderController.getById.bind(orderController));

    }
}

export default OrderRouter;