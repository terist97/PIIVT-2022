import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { AddItemValidator, IAddItemDto } from "./dto/IAddItem.dto";
import { fstat, mkdirSync, readFileSync, unlinkSync } from "fs";
import { extname, basename, dirname } from "path";
import CategoryModel from "../category/CategoryModel.model";
import ItemModel from "./ItemModel.model";
import { EditItemValidator, IEditItemDto } from './dto/IEditItem.dto';
import { DefaultCategoryAdapterOptions } from "../category/CategoryService.service";
// import { DefaultItemAdapterOptions, IItemAdapterOptions } from './ItemService.service';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import { UploadedFile } from "express-fileupload";
import filetype from "magic-bytes.js";
import sizeOf from "image-size";
import * as uuid from "uuid";
import IConfig from "../../common/IConfiginterface";
import DevConfig from "../../configs";
import { IResize } from '../../common/IConfiginterface';
import * as sharp from "sharp";
import IEditItem from './dto/IEditItem.dto';
import { DefaultItemAdapterOptions } from "./ItemService.service";



export default class ItemController extends BaseController {

    async getAllItemsByCategoryId(req: Request, res: Response) {

        const categoryId: number = +req.params?.cid;
        const itemId: number = +req.params?.iid;



        this.services.category.getById(categoryId)
            .then(result => {
                if (result === null) {
                    return res.status(404).send("Category not found!");
                }
                this.services.item.getAllByCategoryId(categoryId, {
                    loadCategory: false,

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
        const data = req.body as IAddItemDto;

        if (!AddItemValidator(data)) {
            return res.status(400).send(AddItemValidator.errors);
        }

        this.services.category.getById(categoryId)
            .then(resultCategory => {
                if (resultCategory === null) {
                    throw { status: 404, message: "Cateogry not found!" };
                }

                return this.services.item.add({
                    name: data.name,
                    category_id: categoryId,
                    description: data.description,
                    price: data.price,

                });
            })
            .then(item => {
                if (!item) {
                    throw { status: 500, message: "Could not add item!" };
                }

                res.send(item);
            })
            .catch(error => {
                res.status(error?.status ?? 500).send(error?.message);
            });
    }


    async uploadPhoto(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const itemId: number = +req.params?.iid;

        this.services.category.getById(categoryId)
            .then(result => {
                if (result === null) throw {
                    code: 404,
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

                return this.doFileUpload(req);
            })
            .then(async uploadedFiles => {


                if (uploadedFiles.length === 0) {
                    throw { message: "Neuspesno uploadovana slika" }
                }


                const singleFile = uploadedFiles[0];

                const filename = basename(singleFile);



                const editedItem = await this.services.item.edit(itemId, {
                    photo_name: filename,
                    photo_path: singleFile,
                }, { loadCategory: true });

                if (editedItem === null) {
                    throw { message: "Neuspesno uploadovana slika" }
                }



                res.send(editedItem);

            })
            .catch(error => {
                res.status(error?.status ?? 500).send(error?.message);
            });


    }

    private async doFileUpload(req: Request): Promise<string[] | null> {
        const config: IConfig = DevConfig;

        if (!req.files || Object.keys(req.files).length === 0) throw {
            code: 400,
            message: "No file were uploaded!",
        };

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
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - type is not supported!`,
                };
            }

            file.name = file.name.toLocaleLowerCase();

            const declaredExtension = extname(file.name);

            if (!config.fileUploads.photos.allowedExtensions.includes(declaredExtension)) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - extension is not supported!`,
                };
            }

            const size = sizeOf(file.tempFilePath);

            if (size.width < config.fileUploads.photos.width.min || size.width > config.fileUploads.photos.width.max) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - image width is not supported!`,
                };
            }

            if (size.height < config.fileUploads.photos.height.min || size.height > config.fileUploads.photos.height.max) {
                unlinkSync(file.tempFilePath);
                throw {
                    code: 415,
                    message: `File ${fileFieldName} - image height is not supported!`,
                };
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

    async edit(req: Request, res: Response) {

        const categoryId: number = +req.params?.cid;

        const data = req.body as IEditItemDto;
        if (!EditItemValidator(data)) {
            return res.status(400).send(EditItemValidator.errors);
        }

        this.services.category.getById(categoryId)
            .then(result => {
                if (result === null) {
                    throw {
                        status: 404,
                        message: "Category not founed!"
                    };
                }

                return result as CategoryModel;
            })
            .then(async category => {
                const itemId: number = +req.params?.iid;
                return {
                    category: category,
                    item: await this.services.item.getById(itemId, {
                        loadCategory: false
                    })
                }

            })

            .then(result => {
                if (result.item === null) {
                    throw {
                        status: 404,
                        message: "item not founed!"
                    };
                }

                if (result.item.categoryId !== categoryId) {
                    throw {
                        status: 404,
                        message: "Item not found in this category!"
                    };
                }

                return result;
            })
            .then(async result => {

                await this.services.item.startTransaction();

                const serviceData: IEditItem = {};

                if (data.name !== undefined) {
                    serviceData.name = data.name;
                }
                if (data.description !== undefined) {
                    serviceData.description = data.description;
                }
                if (data.price !== undefined) {
                    serviceData.price = data.price;
                }
                if (data.isActive !== undefined) {
                    serviceData.is_active = data.isActive ? 1 : 0;
                }

                if (data.photo_name !== undefined) {
                    serviceData.photo_name = data.photo_name;
                }

                if (data.photo_path !== undefined) {
                    serviceData.photo_path = data.photo_path;
                }

                return await this.services.item.edit(result.item.itemId, serviceData, {
                    loadCategory: true,
                })

            })

            .then(async result => {
                await this.services.item.commitChanges();
                res.send(result);
            })



            .catch(async error => {
                await this.services.item.rollbackChanges();
                res.status(error?.status ?? 500).send(error?.message);
            })




    }


    // async deletePhoto(req: Request, res: Response) {
    //     const categoryId: number = +(req.params?.cid);
    //     const itemId: number = +(req.params?.iid);
    //     const photoData = req.body as IEditItemDto;


    //     this.services.category.getById(categoryId)
    //         .then(result => {
    //             if (result === null) throw { status: 404, message: "Category not found" };
    //             return result;

    //         })
    //         .then(async category => {
    //             return {
    //                 category: category,
    //                 item: await this.services.item.getById(itemId, {
    //                     loadCategory: true,

    //                 })
    //             }
    //         })

    //         .then(({ category, item }) => {
    //             if (item === null) throw { status: 404, message: "Item not found" };
    //             if (item.categoryId !== category.categoryId) throw { status: 404, message: "Item not found in this category" };
    //             return item;
    //         })
    //         .then(item => {
    //             const photo = item.photo_name?.search(photo => item.photo_name === photoData.photo_name);

    //         })
    //         .catch(error => {
    //             res.status(error?.status ?? 500).send(error?.message ?? "Server side error!");
    //         })
    // }


}