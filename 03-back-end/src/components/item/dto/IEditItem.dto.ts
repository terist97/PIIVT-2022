import Ajv from "ajv";
import IServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();


export interface IEditItemDto {
    name?: string;
    description?: string;
    price?: number;
    isActive?: boolean;
    photo_name?: string;
    photo_path?: string;

}

export default interface IEditItem extends IServiceData {
    name?: string;
    description?: string;
    price?: number;
    photo_name?: string;
    photo_path?: string;
    is_active?: number;
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
        price: {
            type: "number",
        },
        isActive: {
            type: "boolean",
        },

        photo_name: {
            type: "string",
            minLength: 4,
            maxLength: 32,
        },
        photo_path: {
            type: "string",
            minLength: 4,
            maxLength: 250,
        },
        additionalProperties: false,
    },

    required: [
        // "name",
        //"description",
        //  "isActive",

    ],
    additionalProperties: false,
});

export { EditItemValidator };