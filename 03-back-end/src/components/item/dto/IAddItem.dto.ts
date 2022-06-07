import Ajv from "ajv";
import IServiceData from "../../../common/ServiceData.interface";

const ajv= new Ajv();

export interface IAddItemDto {
    name: string;
    description: string;
   
    photo_name?:string;
    photo_path?:string;
   
}

export default interface IAddItem extends IServiceData {
    name: string;
    description: string;
   
    category_id: number;
    photo_name?:string;
    photo_path?:string;
}

const AddItemValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 8,
            maxLength: 128,
        },
        description: {
            type: "string",
            minLength: 32,
            maxLength: 500,
        }, 
      
        // photo_name:{
        //     type:"string",
        //     minLength:4,
        //     maxLength:32,
        // },
        // photo_path:{
        //     type:"string",
        //     minLength:4,
        //     maxLength:32,
        // },    
    },
    required: [
        "name",
        "description",
       
        // "photo_name",
        // "photo_path",
        
    ],
    additionalProperties: false,
});

export { AddItemValidator };