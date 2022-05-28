import Ajv from "ajv";
import IServiceData from "../../../common/ServiceData.interface";

const ajv= new Ajv();

export interface IAddItemDto {
    name: string;
    description: string;
   
}

export default interface IAddItem extends IServiceData {
    name: string;
    description: string;
    category_id: number;
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
    },
    required: [
        "name",
        "description",
        
    ],
    additionalProperties: false,
});

export { AddItemValidator };