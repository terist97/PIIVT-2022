import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddItemValidator, IAddItemDto } from "./dto/IAddItem.dto";
import { fstat, mkdirSync, readFileSync, unlinkSync } from "fs";
import { extname, basename, dirname } from "path";
import CategoryModel from "../category/CategoryModel.model";
import ItemModel from "./ItemModel.model";
import { EditItemValidator, IEditItemDto } from "./dto/IEditItem.dto";
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
// import { DefaultItemAdapterOptions, IItemAdapterOptions } from './ItemService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';

export default class ItemController extends BaseController {
   
    async getAllItemsByCategoryId(req:Request, res:Response){

        const categoryId: number = +req.params?.cid;
        const itemId: number= +req.params?.iid;


        
        this.services.category.getById(categoryId)
        .then(result => {
            if(result===null){
                return res.status(404).send("Category not found!");
            }
            this.services.item.getAllByCategoryId(categoryId,{
                loadCategory:false,

            })
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });

        })
        .catch(error => {
            res.status(500).send(error?.message);
        });

    }

    async getItemById(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const itemId: number = +req.params?.iid;

        this.services.category.getById(categoryId)
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found!");
            }

            this.services.item.getById(itemId, {
                loadCategory: true,
               
            })
            .then(result => {
                if (result === null) {
                    return res.status(404).send("Item not found!");
                }

                if (result.categoryId !== categoryId) {
                    return res.status(404).send("Item not found in this category!");
                }

                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }


    async add(req: Request, res: Response) {
         const categoryId: number = +req.params?.cid;
         const data               =  req.body as IAddItemDto;

         if (!AddItemValidator(data)) {
            return res.status(400).send(AddItemValidator.errors);
         }

         this.services.category.getById(categoryId)
         .then(resultCategory => {
            if (resultCategory === null) {
                 return res.status(404).send("Category not found!");
             }
                 this.services.item.add({
                     name: data.name,
                     category_id: categoryId,
                     description: data.description,
                     photo_name:data.photo_name,
                     photo_path:data.photo_path
                     
                 })


                 //??? newItem
                })               
                 .catch(error => {
                     res.status(500).send(error?.message);
                 })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        }
    }