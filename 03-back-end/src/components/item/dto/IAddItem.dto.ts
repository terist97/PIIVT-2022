import Ajv from "ajv";
import IServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();

export interface IAddItemDto {
    name: string;
    description: string;
    price: number;
    photo_name?: string;
    photo_path?: string;

}

export default interface IAddItem extends IServiceData {
    name: string;
    description: string;
    price: number;
    category_id: number;
    photo_name?: string;
    photo_path?: string;
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
        price: {
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,
        }

    },
    required: [
        "name",
        "description",
        //"number",

    ],
    additionalProperties: false,
});

export { AddItemValidator };