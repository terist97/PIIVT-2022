import BaseService from '../../common/BaseService';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import OrderModel from './OrderModel.model';


export interface IOrderAdapterOptions extends IAdapterOptions{
loadCartData:boolean;
}

export const DefaultOrderAdapterOptions: IOrderAdapterOptions={
    loadCartData:true,
}
export default class OrderService extends BaseService<OrderModel, IOrderAdapterOptions>{
    tableName(): string {
        return "order";
    }
    protected async adaptToModel(data: any, options: IOrderAdapterOptions=DefaultOrderAdapterOptions): Promise<OrderModel> {
        return new Promise(async resolve=> {
            const order = new OrderModel();

            order.orderId=+data?.order_id;
            order.cartId=+data?.cart_id;
            order.createdAt=new Date(data?.created_at);

            order.user_name=data?.user_name;
            order.user_surname=data?.user_surname;
            order.user_address=data?.user_address;
            order.user_email=data?.user_email;

            if(options.loadCartData){
                order.cart=await this.services.cart.getById(order.cartId, {} );
            }
            resolve(order);
        })
    }
    

     public async getByCartId(cartId:number): Promise<OrderModel|null> {
         return new Promise((resolve, reject) => {
             this.getAllByFieldNameAndValue("cart_id", cartId, {loadCartData:false,})
             .then(result => {
                 if(result.length ===0) {
               return resolve(null);
           }  

              resolve(result[0]);
         })
              .catch(error =>{
                reject(error);
     });
         });
     }
}