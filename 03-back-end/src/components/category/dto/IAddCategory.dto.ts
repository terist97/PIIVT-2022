import Ajv from "ajv";

const ajv = new Ajv();

export default interface IAddCategory{
    name: string;
    photo_name:string;
    photo_path:string;
}

const AddCategoryValidator =ajv.compile({

    type: "object",
    properties: {
        name:{
            type:"string",
            minLength:4,
            maxLength:32,
        },
    },
    required:[
        "name",
    ],
    additionalProperties:false, 

});
export {AddCategoryValidator};


