import BaseService from "../../common/BaseService";
import OrderModel from "./OrderModel.model";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import * as mysql2 from 'mysql2/promise';

import { rejects } from "assert";
import IAddOrder from "./dto/IAddOrder.dto";

export class OrderAdapterOptions implements IAdapterOptions {

}

export const DefaultOrderAdapterOptions: OrderAdapterOptions = {

}


export default class OrderService extends BaseService<OrderModel, OrderAdapterOptions> {
    tableName(): string {
        return "order";
    }

    protected async adaptToModel(data: any, options: OrderAdapterOptions = DefaultOrderAdapterOptions): Promise<OrderModel> {
        return new Promise(async (resolve) => {
            const order = new OrderModel();

            order.orderId = +data?.order_id;
            order.forename = data?.name;
            order.surname = data?.surname;
            order.email = data?.email;
            order.address = data?.address;
            order.createdAt = data?.created_at;



            resolve(order);

        })
    }
    public async getById(orderId: number): Promise<OrderModel | null> {

        return new Promise<OrderModel>(
            (resolve, reject) => {
                const sql: string = "SELECT * FROM `order` WHERE order_id=?;";
                this.db.execute(sql, [orderId])
                    .then(async ([rows]) => {

                        if (rows === undefined) {
                            return resolve(null);
                        }

                        if (Array.isArray(rows) && rows.length === 0) {
                            return resolve(null);
                        }
                        resolve(await this.adaptToModel(rows[0]));


                    })
                    .catch(error => {

                        reject(error);


                    });
            }
        );
    }


    public async getAll(): Promise<OrderModel[]> {

        return new Promise<OrderModel[]>(
            (resolve, reject) => {

                const sql: string = "SELECT * FROM `order` ;";
                this.db.execute(sql)
                    .then(async ([rows]) => {

                        if (rows === undefined) {
                            return resolve([]);
                        }

                        const orders: OrderModel[] = [];
                        for (const row of rows as mysql2.RowDataPacket[]) {


                            orders.push(await this.adaptToModel(row));
                        }
                        resolve(orders);
                    })
                    .catch(error => {

                        reject(error);


                    });

            });







    }


    // public async getByUsername(user_name: string): Promise<OrderModel | null> {
    //     return new Promise((resolve, reject) => {
    //         this.getAllByFieldNameAndValue("user_name", user_name, {

    //         })

    //             .then(result => {
    //                 if (result.length === 0) {
    //                     return resolve(null);
    //                 }

    //                 resolve(result[0]);
    //             })

    //             .catch(error => {
    //                 rejects(error);

    //             })

    //     });
    // }
    public async add(data: IAddOrder): Promise<OrderModel> {
        return this.baseAdd(data, DefaultOrderAdapterOptions);
    }


}