import CategoryModel from './CategoryModel.model';
import * as mysql2 from 'mysql2/promise';
import IAddCategory from './dto/IAddCategory.dto';



class CategoryService{

    private db: mysql2.Connection;

    constructor(databaseConnection: mysql2.Connection){

        this.db = databaseConnection;

    }

    private async adaptToModel(data: any): Promise<CategoryModel>{
        const category: CategoryModel = new CategoryModel();

        category.categoryId=+data?.category_id;
        category.name= data?.name;
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
        return new Promise<CategoryModel>((resolve,reject) => {

            const sql:string = "INSERT `CATEGORY` set `name` =?;";

            this.db.execute(sql,[ data.name])
            .then(async result => {
                const info: any = result;
                const newCategoryId= +(info[0].insertId);

                const newCategory : CategoryModel | null = await this.getById(newCategoryId);
                
                if(newCategory === null) {
                   return reject({
                        message: 'Duplicate category name'
                    });
                }

                resolve(newCategory);
            })
            .catch(error => {
                reject(error);
            })
        })
    }
}


export default CategoryService;