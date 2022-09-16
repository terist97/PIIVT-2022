import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';

export default class OrderController extends BaseController {

    getAll(req: Request, res: Response) {
        this.services.order.getAll()
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }

    getById(req: Request, res: Response) {
        const id: number = +req.params?.id;

        this.services.order.getById(id)
            .then(result => {
                if (result === null) {
                    return res.sendStatus(404);
                }
                res.send(result);

            })
            .catch(error => {
                res.status(500).send(error?.message);
            });




    }
}