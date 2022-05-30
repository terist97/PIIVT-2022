import BaseService from "../../common/BaseService"
import IAdapterOptions from "../../common/IAdapterOptions.interface"
import ItemModel from "./ItemModel.model"
import IAddItem from './dto/IAddItem.dto';
import IEditItem from './dto/IEditItem.dto';

export interface IItemAdapterOptions extends IAdapterOptions {
    loadCategory: boolean,
 
}

export class DefaultItemAdapterOptions implements IItemAdapterOptions {
    loadCategory: false;
  
}
// ovde treba da budes exportovana classs


export default class ItemService extends BaseService<ItemModel,IItemAdapterOptions>{
    tableName(): string {
        return "item";
    }
    protected adaptToModel(data: any, options: IItemAdapterOptions): Promise<ItemModel> {
        return new Promise(async (resolve) => {
            const item = new ItemModel();

            item.itemId      = +data?.item_id;
            item.name        = data?.name;
            item.description = data?.description;
            item.categoryId  = +data?.category_id;
            item.isActive    = +data?.is_active === 1;
            item.photo_name=data?.photo_name;
            item.photo_path=data?.photo_path;


            if(options.loadCategory){
                item.category = await this.services.category.getById(item.categoryId)
            };

        

            resolve(item);

        })   
    }
    async getAllByCategoryId(categoryId: number, options: IItemAdapterOptions) {
        return this.getAllByFieldNameAndValue("category_id", categoryId, options);
    }

     async add(data: IAddItem): Promise<ItemModel> {
         return this.baseAdd(data, {loadCategory:false});
     }

     

    // async edit(itemId: number, data: IEditItem, options: IItemAdapterOptions): Promise<ItemModel> {
    //     return this.baseEditById(itemId, data, options);
    // }

   
    
}