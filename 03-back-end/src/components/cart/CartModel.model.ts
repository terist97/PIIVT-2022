import IModel from "../../common/IModel.inteface";
import ItemModel from "../item/ItemModel.model";

export default class CartModel implements IModel{

    cartId:number;
    createdAt:Date;
    itemId:number;
    quantity:number;

    item:ItemModel;

    isUsed:boolean;
    
}