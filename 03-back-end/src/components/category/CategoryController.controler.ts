import CategoryService from './CategoryService.service';
import { Request, Response} from "express";
import { AddCategoryValidator } from './dto/IAddCategory.dto';
import IAddCategory from './dto/IAddCategory.dto';
import CategoryModel from './CategoryModel.model';
import IEditCategory, { EditCategoryValidator, IEditCategoryDto } from './dto/IEditCategory.dto';
import BaseController from '../../common/BaseController';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import { mkdirSync, readFileSync, unlinkSync } from 'fs';
import { UploadedFile } from 'express-fileupload';
import { extname, basename, dirname } from "path";
import sizeOf, { disableFS } from "image-size";
import * as uuid from "uuid";
import filetype from "magic-bytes.js";


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

            const serviceData:IEditCategory={};

            if(data.name!==undefined){
                serviceData.name=data.name;
            }
            if(data.description!==undefined){
                serviceData.description=data.description;
            }
            if(data.photo_name!==undefined){
                serviceData.photo_name=data.photo_name;
            }

            if(data.photo_path!==undefined){
                serviceData.photo_path=data.photo_path;
            }

            this.services.category.editById(id,serviceData 
               // name:data.name,
                //description:data.description,
                // photo_name:data.photo_name,
                // photo_path:data.photo_path,
            )
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

    async uploadPhoto(req:Request, res:Response){

        const id:number = +req.params?.cid;

        this.services.category.getById(id)
        .then(async result => {
            if(result===null){
                throw{status:404,message:"Ne postoji kategorija"}
            }
            return result;

        })
        .then(async category => {
            const uploadedFiles = this.doFileUpload(req,res);

            if(uploadedFiles===null){
                throw{message:"Neuspesno uploadovana slika"}
            }
     
     
            const singleFile=uploadedFiles[0];
            
             const filename=basename(singleFile);
             
             
             
          const editedCategory= await this.services.category.editById(id,{
                 photo_name:filename,
                 photo_path:singleFile,
             });
     
                 if(editedCategory === null){
                    throw{message:"Neuspesno uploadovana slika"}
                 }
     
                
            
             res.send(editedCategory);

        })
        .catch(error => {
            res.status(error?.status??500).send(error?.message);
        });


      
    }

    private doFileUpload(req:Request, res: Response): string[]| null{
       if(!req.files || Object.keys(req.files).length===0){
        res.status(400).send("No file were uploaded!");
        return null;
   }

   const fileFieldNames = Object.keys(req.files);

   const now=new Date();
   const year=now.getFullYear();
   const month = ((now.getMonth()+1)+ "").padStart(2,"0");

   const uploadDestinationRoot="./static/";
   const destinationDirectory="uploads/" + year + "/" + month + "/";

   mkdirSync(uploadDestinationRoot+destinationDirectory,{
       recursive:true,
       mode: "755",

   });

   const uploadedFiles = [];

   for(let fileFieldName of fileFieldNames){
       const file = req.files[fileFieldName] as UploadedFile;
       
       const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;
       
       if(!["png", "jpg"].includes(type)){
           unlinkSync(file.tempFilePath);
            res.status(415).send(`File ${fileFieldName}type is not supported!`);
           return null;

       }
       const declaredExtension = extname(file.name);

       if(![".png", "jpg"].includes(declaredExtension)){
           unlinkSync(file.tempFilePath);
           res.status(415).send(`File ${fileFieldName} extension is not supported!`);
            return null;


       }

       const size= sizeOf(file.tempFilePath);

       if(size.width < 320 || size.width > 1920){
           unlinkSync(file.tempFilePath);
          res.status(415).send(`Image width ${fileFieldName}is not supported!`);
          return null; 
       }


       if(size.height < 240 || size.height > 1080){
           unlinkSync(file.tempFilePath);
         res.status(415).send(`Image height ${fileFieldName} is not supported!`);
         return null; 
       }

       const fileNameRandomPart = uuid.v4();

       const fileDestinationPath= uploadDestinationRoot + destinationDirectory + fileNameRandomPart+"-"+ file.name;

       file.mv(fileDestinationPath, error => {
           if(error){
           res.status(500).send("This file could be saved");
           return null;
           }
       });

       uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-"+ file.name);
   }

       return uploadedFiles;

       
   }  

    }  

   


export default CategoryController;

