import Ajv from "ajv";
import IServiceData from '../../../common/ServiceData.interface';

const ajv = new Ajv();

export default interface IEditCategory extends IServiceData{
    name: string;
    photo_name:string;
    photo_path:string;
}
 interface IEditCategoryDto{
    name:string;
    photo_name:string;
    photo_path:string;
}
const EditCategoryValidator =ajv.compile({

    type: "object",
    properties: {
        name:{
            type:"string",
            minLength:4,
            maxLength:32,
        },
        photo_name:{
            type:"string",
            minLength:4,
            maxLength:32,
        },
        photo_path:{
            type:"string",
            minLength:4,
            maxLength:32,
        },
        
    },
    required:[
        "name",
        "photo_name",
        "photo_path"
    ],
    additionalProperties:false, 

});
export {EditCategoryValidator, IEditCategoryDto};


