import BaseService from "../../common/BaseService";
import CartModel from './CartModel.model';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import { IOrderAdapterOptions } from './OrderService.service';

export interface ICartAdapterOptions extends IAdapterOptions{
    
}



export default class CartService extends BaseService<CartModel,ICartAdapterOptions>{
    tableName(): string {
        return "cart";
    }
    protected adaptToModel(data: any, options: ICartAdapterOptions={}): Promise<CartModel> {
        return new Promise (async resolve => {
            const cart=new CartModel();

            cart.cartId=+data.cart_id;
            cart.createdAt=new Date(data?.created_at);

            cart.itemId=+data.item_id;

            cart.quantity=+data.quantity;

            cart.isUsed=false;
 

            if(await this.services.order.getByCartId(cart.cartId)){
            cart.isUsed=true;
            }


            return cart;
        });
    }

    async getUserCart(id:number): Promise<CartModel> {
        return new Promise(resolve => {
            this.getAllByCartId(id)
            .then (cart => {
                if(cart.length === 0){
                    // return this.baseAdd(
                       // cart.cartId:id,
                    // )
                }
            })
            .then(cart => {

            })
        });
    }

    async getAllByCartId(cartId:number, options: ICartAdapterOptions={}): Promise<CartModel[]>{
       return  this.getAllByFieldNameAndValue("cart_id", cartId, options);
    }


    
}