import CategoryService from './CategoryService.service';
import { Request, Response} from "express";
import { AddCategoryValidator } from './dto/IAddCategory.dto';
import IAddCategory from './dto/IAddCategory.dto';
import CategoryModel from './CategoryModel.model';
import IEditCategory, { EditCategoryValidator, IEditCategoryDto } from './dto/IEditCategory.dto';
import BaseController from '../../common/BaseController';


class CategoryController extends BaseController{
   

    async getAll(req : Request, res: Response){
        
        this.services.category.getAll()
        .then(result => {
            res.send(result);
        })
        .catch(error =>{
            res.status(500).send(error?.message);
        });

    }

    async getById(req: Request, res: Response){
        const id:number = +req.params?.id;

        this.services.category.getById(id)
        .then(result => {
            if(result===null){
                return res.sendStatus(404);
            }
            res.send(result);

        })
        .catch(error => {
            res.status(500).send(error?.message);
        });


       

      
    }

    async add(req: Request, res: Response) {
        const data=req.body as IAddCategory;

        if(!AddCategoryValidator(data)){
            return res.status(400).send(AddCategoryValidator.errors);
        }

        this.services.category.add(data)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(400).send(error?.message);
        })
    }

    async edit(req:Request, res:Response){
        const id:number = +req.params?.cid;
        const data=req.body as IEditCategoryDto;
        if(!EditCategoryValidator(data)){
            return res.status(400).send(EditCategoryValidator.errors);
        }
        this.services.category.getById(id)
        .then(result => {
            if(result===null){
                return res.sendStatus(404);
            }
            this.services.category.editById(id, {
                name:data.name,
                photo_name:data.photo_name,
                photo_path:data.photo_path,
            })
            .then(result => {
                res.send(result);
            })
            .catch(error=> {
                res.status(400).send(error?.message);
            })

        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async getAllItemsByCategoryId(req:Request, res:Response){

        const categoryId: number = +req.params?.cid;

        
        this.services.category.getById(categoryId)
        .then(result => {
            if(result===null){
                return res.sendStatus(404).send("Category not found!");
            }
            this.services.item.getAll

        })
        .catch(error => {
            res.status(500).send(error?.message);
        });

    }
}

export default CategoryController;