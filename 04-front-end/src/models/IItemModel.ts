import ICategory from './ICategory.model';
export default interface IItem {
    category?:ICategory | null;
    itemId:number;
    name:string;
    description:string;
    
    categoryId:number;
    isActive:boolean;
    photo_name?:string;
    photo_path?:string;

}