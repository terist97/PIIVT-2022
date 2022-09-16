import CategoryService from './CategoryService.service';
import { Request, Response } from "express";
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
import DevConfig from '../../configs';
import IConfig, { IResize } from '../../common/IConfiginterface';
import sharp = require('sharp');


class CategoryController extends BaseController {


    async getAll(req: Request, res: Response) {


        this.services.category.getAll()
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });

    }

    async getById(req: Request, res: Response) {
        const id: number = +req.params?.id;

        this.services.category.getById(id)
            .then(result => {
                if (result === null) {
                    return res.sendStatus(404);
                }
                res.send(result);

            })
            .catch(error => {
                res.status(500).send(error?.message);
            });





    }

    async add(req: Request, res: Response) {
        const data = req.body as IAddCategory;

        if (!AddCategoryValidator(data)) {
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

    async edit(req: Request, res: Response) {
        const id: number = +req.params?.cid;
        const data = req.body as IEditCategoryDto;
        if (!EditCategoryValidator(data)) {
            return res.status(400).send(EditCategoryValidator.errors);
        }
        this.services.category.getById(id)
            .then(result => {
                if (result === null) {
                    return res.sendStatus(404);
                }

                const serviceData: IEditCategory = {};

                if (data.name !== undefined) {
                    serviceData.name = data.name;
                }
                if (data.description !== undefined) {
                    serviceData.description = data.description;
                }

                if (data.photo_name !== undefined) {
                    serviceData.photo_name = data.photo_name;
                }

                if (data.photo_path !== undefined) {
                    serviceData.photo_path = data.photo_path;
                }

                this.services.category.editById(id, serviceData
                    // name:data.name,
                    //description:data.description,
                    // photo_name:data.photo_name,
                    // photo_path:data.photo_path,
                )
                    .then(result => {
                        res.send(result);
                    })
                    .catch(error => {
                        res.status(400).send(error?.message);
                    })

            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }

    async uploadPhoto(req: Request, res: Response) {

        const id: number = +req.params?.cid;

        this.services.category.getById(id)
            .then(async result => {
                if (result === null) {
                    throw { status: 404, message: "Ne postoji kategorija" }
                }
                return result;

            })
            .then(async category => {
                const uploadedFiles = this.doFileUpload(req, res);

                if (uploadedFiles === null) {
                    throw { message: "Neuspesno uploadovana slika" }
                }


                const singleFile = uploadedFiles[0];

                const filename = basename(singleFile);



                const editedCategory = await this.services.category.editById(id, {
                    photo_name: filename,
                    photo_path: singleFile,
                });

                if (editedCategory === null) {
                    throw { message: "Neuspesno uploadovana slika" }
                }



                res.send(editedCategory);

            })
            .catch(error => {
                res.status(error?.status ?? 500).send(error?.message);
            });



    }

    private doFileUpload(req: Request, res: Response): string[] | null {
        const config: IConfig = DevConfig;
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("No file were uploaded!");
            return null;
        }

        const fileFieldNames = Object.keys(req.files);

        const now = new Date();
        const year = now.getFullYear();
        const month = ((now.getMonth() + 1) + "").padStart(2, "0");

        const uploadDestinationRoot = config.server.static.path + "/";
        const destinationDirectory = config.fileUploads.destinationDirectoryRoot + year + "/" + month + "/";

        mkdirSync(uploadDestinationRoot + destinationDirectory, {
            recursive: true,
            mode: "755",

        });

        const uploadedFiles = [];

        for (let fileFieldName of fileFieldNames) {
            const file = req.files[fileFieldName] as UploadedFile;

            const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;

            if (!config.fileUploads.photos.allowedTypes.includes(type)) {
                unlinkSync(file.tempFilePath);
                res.status(415).send(`File ${fileFieldName}type is not supported!`);
                return null;

            }
            const declaredExtension = extname(file.name);

            if (!config.fileUploads.photos.allowedExtensions.includes(declaredExtension)) {
                unlinkSync(file.tempFilePath);
                res.status(415).send(`File ${fileFieldName} extension is not supported!`);
                return null;


            }

            const size = sizeOf(file.tempFilePath);

            if (size.width < config.fileUploads.photos.width.min || size.width > config.fileUploads.photos.width.max) {
                unlinkSync(file.tempFilePath);
                res.status(415).send(`Image width ${fileFieldName}is not supported!`);
                return null;
            }


            if (size.height < config.fileUploads.photos.height.min || size.height > config.fileUploads.photos.height.max) {
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

                for (let resizeOptions of config.fileUploads.photos.resize) {
                    await this.createResizedPhotos(destinationDirectory, fileNameRandomPart + "-" + file.name, resizeOptions);
                }
            });

            uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-" + file.name);
        }

        return uploadedFiles;
    }

    private async createResizedPhotos(directory: string, filename: string, resizeOptions: IResize) {
        const config: IConfig = DevConfig;

        await sharp(config.server.static.path + "/" + directory + filename)
            .resize({
                width: resizeOptions.width,
                height: resizeOptions.height,
                fit: resizeOptions.fit,
                background: resizeOptions.defaultBackground,
                withoutEnlargement: true,
            })
            .toFile(config.server.static.path + "/" + directory + resizeOptions.prefix + filename);
    }

    async deletePhoto(req: Request, res: Response) {
        const categoryId: number = +(req.params?.cid);




        this.services.category.getById(categoryId)
            .then(result => {
                if (result === null) {
                    throw { status: 400, message: "Category not found" };
                    return result;

                }
            })
            .then(category => {
                this.services.category.editById(categoryId, {
                    photo_name: null,
                    photo_path: null,
                });

            })
            .then(() => {
                res.send("Deleted!");
            })
            .catch(error => {
                res.status(error?.status ?? 500).send(error?.message ?? "server side error");
            })
    }

}




export default CategoryController;

