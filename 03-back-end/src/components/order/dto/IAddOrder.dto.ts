import Ajv from "ajv";
import IServiceData from '../../../common/ServiceData.interface';

const ajv = new Ajv();

export default interface IAddOrder extends IServiceData {
    forename: string;
    surname: string;
    address: string;
    email: string;

}

// interface IAddCategoryDto{
//     name:string;
//     photo_name:string;
//     photo_path:string;
// }

const AddOrderValidator = ajv.compile({

    type: "object",
    properties: {
        forename: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
        surname: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
        address: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
        email: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },


    },
    required: [
        "forename",
        "surname",
        "address",
        "email",



    ],
    additionalProperties: false,

});
export { AddOrderValidator };
