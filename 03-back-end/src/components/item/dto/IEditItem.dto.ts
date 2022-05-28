import Ajv from "ajv";
import IServiceData from "../../../common/ServiceData.interface";

const ajv= new Ajv();


export interface IEditItemDto {
    name: string;
    description: string;
    isActive: boolean;
   
}

export default interface IEditItem extends IServiceData {
    name: string;
    description: string;
    is_active: number;
}
const EditItemValidator = ajv.compile({
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
      additionalProperties: false,
            },
        
    required: [
        "name",
        "description",
        "isActive",
        
    ],
    additionalProperties: false,
});

export { EditItemValidator };