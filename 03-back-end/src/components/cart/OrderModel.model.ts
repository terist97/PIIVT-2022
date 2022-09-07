import IModel from "../../common/IModel.inteface";
import CartModel from "./CartModel.model";

export default class OrderModel implements IModel{
    

    orderId:number;
    cartId:number;
    createdAt:Date;
    user_name:string;
    user_surname:string;
    user_address:string;
    user_email:string;

    cart: CartModel;

}