import Ajv from "ajv";
import IServiceData from '../../../common/ServiceData.interface';

const ajv = new Ajv();

export interface IAdministratorLoginDto{
    username:string;
    password:string;

}

const AddAdministratorLoginValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            pattern: "^[a-z\-]{5,64}$",
        },
        password: {
            type: "string",
            pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
        }
    },
    required: [
        "username",
        "password",
    ],
    additionalProperties: false,
});

export { AddAdministratorLoginValidator };

