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
import { UploadedFile } from "express-fileupload";
import filetype from "magic-bytes.js";
import sizeOf from "image-size";
import * as uuid from "uuid";
import IConfig from "../../common/IConfiginterface";
import DevConfig from "../../configs";



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
                   //  price:data.price,
                    //  photo_name:data.photo_name,
                    //  photo_path:data.photo_path
                     
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

    // async uploadPhoto(req:Request, res:Response){

    //     const categoryId: number = +req.params?.cid;
    //     const itemId: number = +req.params?.iid;

    //     this.services.category.getById(categoryId)
    //     .then(result => {
    //         if (result === null) {
    //             return res.status(404).send("Category not found!");
    //         }

    //         this.services.item.getById(itemId, {
    //             loadCategory: false,
               
    //         })
    //         .then(result => {
    //             if (result === null) {
    //                 return res.status(404).send("Item not found!");
    //             }

    //             if (result.categoryId !== categoryId) {
    //                 return res.status(404).send("Item not found in this category!");
    //             }

    //            const uploadedFiles = this.doFileUpload(req,res);

    //            if(uploadedFiles===null){
    //                return;
    //            }

    //             for(let singleFile of uploadedFiles){
    //         //         const filename=basename(singleFile);
    //         //         this.services.item.add({
                       
    //         //         photo_name:filename,
    //         //         photo_path:singleFile,
    //         //         }) NE ZNAM KAKO BI TREBAO OVAJ DEO SA SLIKAMA ZBOG OSTALIH ARGUMENATA(name,desc)
    //            }

    //         })
    //         .catch(error => {
    //             res.status(500).send(error?.message);
    //         });
    //     })
    //     .catch(error => {
    //         res.status(500).send(error?.message);
    //     }); 
    // }  

    // private doFileUpload(req: Request, res: Response):string[]|null {

    // if(!req.files || Object.keys(req.files).length===0){
    //      res.status(400).send("No file were uploaded!");
    //      return null;
    // }

    // const fileFieldNames = Object.keys(req.files);

    // const now=new Date();
    // const year=now.getFullYear();
    // const month = ((now.getMonth()+1)+ "").padStart(2,"0");

    // const uploadDestinationRoot="./static/";
    // const destinationDirectory="uploads/" + year + "/" + month + "/";

    // mkdirSync(uploadDestinationRoot+destinationDirectory,{
    //     recursive:true,
    //     mode: "755",

    // });

    // const uploadedFiles = [];

    // for(let fileFieldName of fileFieldNames){
    //     const file = req.files[fileFieldName] as UploadedFile;
        
    //     const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;
        
    //     if(!["png", "jpg"].includes(type)){
    //         unlinkSync(file.tempFilePath);
    //          res.status(415).send(`File ${fileFieldName}type is not supported!`);
    //          return null;

    //     }
    //     const declaredExtension = extname(file.name);

    //     if(![".png", "jpg"].includes(declaredExtension)){
    //         unlinkSync(file.tempFilePath);
    //         res.status(415).send(`File ${fileFieldName} extension is not supported!`);
    //         return null;


    //     }

    //     const size= sizeOf(file.tempFilePath);

    //     if(size.width < 320 || size.width > 1920){
    //         unlinkSync(file.tempFilePath);
    //         res.status(415).send(`Image width ${fileFieldName}is not supported!`);
    //         return null;
    //     }


    //     if(size.height < 240 || size.height > 1080){
    //         unlinkSync(file.tempFilePath);
    //         res.status(415).send(`Image height ${fileFieldName} is not supported!`);
    //         return null;
    //     }

    //     const fileNameRandomPart = uuid.v4();

    //     const fileDestinationPath= uploadDestinationRoot + destinationDirectory + fileNameRandomPart+"-"+ file.name;

    //     file.mv(fileDestinationPath, error => {
    //         res.status(500).send(error);
    //         return null;
    //     });

    //     uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-"+ file.name);
    // }

    //     return uploadedFiles;

    // }
    async uploadPhoto(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const itemId: number = +req.params?.iid;

        this.services.category.getById(categoryId)
        .then(result => {
            if (result === null) throw {
                code: 400,
                message: "Category not found!",
            };

            return result;
        })
        .then(() => {
            return this.services.item.getById(itemId, {
                loadCategory: false,
               
            });
        })
        .then(result => {
            if (result === null) throw {
                code: 404,
                message: "Item not found!",
            };

            if (result.categoryId !== categoryId) throw {
                code: 404,
                message: "Item not found in this category!",
            };

            return this.doFileUpload(req,res);
        })
        .then(async item => {
            const uploadedFiles = this.doFileUpload(req,res);

            if(uploadedFiles===null){
                throw{message:"Neuspesno uploadovana slika"}
            }
     
     
             const singleFile=uploadedFiles[0];
            
             const filename=basename(singleFile);
             
             
             
          const editedItem= await this.services.item.edit(itemId,{
                 photo_name:filename,
                 photo_path:singleFile,
             },{loadCategory:false});
     
                 if(editedItem === null){
                    throw{message:"Neuspesno uploadovana slika"}
                 }
     
                
            
             res.send(editedItem);

        })
        .catch(error => {
            res.status(error?.status??500).send(error?.message);
        });

    }

    private doFileUpload(req:Request, res: Response): string[]| null{
        const config: IConfig =DevConfig;
        if(!req.files || Object.keys(req.files).length===0){
         res.status(400).send("No file were uploaded!");
         return null;
    }
 
    const fileFieldNames = Object.keys(req.files);
 
    const now=new Date();
    const year=now.getFullYear();
    const month = ((now.getMonth()+1)+ "").padStart(2,"0");
 
    const uploadDestinationRoot=config.server.static.path+ "/";
    const destinationDirectory=config.fileUploads.destinationDirectoryRoot+ year +"/"+ month + "/";
 
    mkdirSync(uploadDestinationRoot+destinationDirectory,{
        recursive:true,
        mode: "755",
 
    });
 
    const uploadedFiles = [];
 
    for(let fileFieldName of fileFieldNames){
        const file = req.files[fileFieldName] as UploadedFile;
        
        const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;
        
        if(!config.fileUploads.photos.allowedTypes.includes(type)){
            unlinkSync(file.tempFilePath);
             res.status(415).send(`File ${fileFieldName}type is not supported!`);
            return null;
 
        }
        const declaredExtension = extname(file.name);
 
        if(!config.fileUploads.photos.allowedExtensions.includes(declaredExtension)){
            unlinkSync(file.tempFilePath);
            res.status(415).send(`File ${fileFieldName} extension is not supported!`);
             return null;
 
 
        }
 
        const size= sizeOf(file.tempFilePath);
 
        if(size.width < config.fileUploads.photos.width.min|| size.width > config.fileUploads.photos.width.max){
            unlinkSync(file.tempFilePath);
           res.status(415).send(`Image width ${fileFieldName}is not supported!`);
           return null; 
        }
 
 
        if(size.height < config.fileUploads.photos.height.min || size.height > config.fileUploads.photos.height.max){
            unlinkSync(file.tempFilePath);
          res.status(415).send(`Image height ${fileFieldName} is not supported!`);
          return null; 
        }
 
        const fileNameRandomPart = uuid.v4();

        const fileDestinationPath = uploadDestinationRoot + destinationDirectory + fileNameRandomPart + "-" + file.name;

        file.mv(fileDestinationPath, async error => {
            if (error) {
                throw {
                    code: 500,
                    message: `File ${fileFieldName} - could not be saved on the server!`,
                };
            }
       });

       uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-"+ file.name);
   }

       return uploadedFiles;
    }  

    }