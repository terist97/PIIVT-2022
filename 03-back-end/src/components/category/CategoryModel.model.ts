import IModel from '../../common/IModel.inteface';
class CategoryModel implements IModel{

    categoryId:number;
    name:string;
    description:string;
    photo_name:string;
    photo_path:string;
}

export default CategoryModel;