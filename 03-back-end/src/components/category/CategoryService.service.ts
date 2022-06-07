import CategoryModel from './CategoryModel.model';
import * as mysql2 from 'mysql2/promise';
import IAddCategory from './dto/IAddCategory.dto';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import BaseService from '../../common/BaseService';
import IEditCategory from './dto/IEditCategory.dto';

interface ICategoryAdapterOptions extends IAdapterOptions{}

const DefaultCategoryAdapterOptions: ICategoryAdapterOptions={}




class CategoryService extends BaseService<CategoryModel, ICategoryAdapterOptions>{

    tableName(): string {
        return "category";
    }
   


    protected async adaptToModel(data: any, options:ICategoryAdapterOptions=DefaultCategoryAdapterOptions): Promise<CategoryModel>{
        const category: CategoryModel = new CategoryModel();

        category.categoryId=+data?.category_id;
        category.name= data?.name;
        category.description=data?.description;
        category.photo_name=data?.photo_name;
        category.photo_path=data?.photo_path;



        return category;
    }

    public async getAll(): Promise<CategoryModel[]> {
        
        return new Promise<CategoryModel[]>(
        (resolve, reject) => {

            const sql:string="SELECT * FROM `category` ORDER BY `name` ;";
            this.db.execute(sql)
            .then( async ( [ rows ] ) =>{

                if(rows === undefined){
                    return resolve ([]);
                }

                const categories: CategoryModel[]= [];
                for (const row of rows as mysql2.RowDataPacket[]){
                   

                  categories.push(await  this.adaptToModel(row));
                }
                resolve(categories);
            })
            .catch(error => {
    
                reject(error);

    
            });

        });


       
        
        

      
    }

    public async getById(categoryId: number): Promise<CategoryModel| null> {
       
     return new Promise<CategoryModel>(
        (resolve,reject) =>{
            const sql: string = "SELECT * FROM `category` WHERE category_id=?;";
            this.db.execute(sql, [ categoryId])
            .then( async ( [ rows ] ) =>{

                if(rows === undefined){
                    return resolve (null);
                }

                if(Array.isArray(rows) && rows.length===0){
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

    public async add(data: IAddCategory): Promise<CategoryModel> {
      return this.baseAdd(data,DefaultCategoryAdapterOptions);
    }

    public async editById(categoryId:number, data: IEditCategory, options:ICategoryAdapterOptions =DefaultCategoryAdapterOptions ): Promise <CategoryModel>{
        return this.baseEditById(categoryId,data,DefaultCategoryAdapterOptions);
        
    }
   
}


export default CategoryService;
export {DefaultCategoryAdapterOptions};