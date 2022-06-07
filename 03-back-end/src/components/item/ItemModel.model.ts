import IModel from "../../common/IModel.inteface";
import CategoryModel from '../category/CategoryModel.model';
export default class ItemModel implements IModel {

    itemId:number;
    name:string;
    description:string;
    
    categoryId:number;
    isActive:boolean;
    photo_name?:string;
    photo_path?:string;

    


    category?:CategoryModel=null;


}
