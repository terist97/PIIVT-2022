import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";



export interface IAdminCategoryAddUrlParams extends Record<string, string | undefined> {
    cid: string
}

interface IAddItemFormState {
    name: string;
    description: string;
    
  
};

type TSetName          = { type: "addItemForm/setName",          value: string };
type TSetDescription   = { type: "addItemForm/setDescription",   value: string };


type AddItemFormAction = TSetName
                       | TSetDescription
                       
                     

function AddItemFormReducer(oldState: IAddItemFormState, action: AddItemFormAction): IAddItemFormState {
    switch (action.type) {
        case "addItemForm/setName": {
            return {
                ...oldState,
               
                name: action.value,
            }
        }

        case "addItemForm/setDescription": {
            return {
                ...oldState,
               
                description: action.value,
            }
        }
       

        

        default: return oldState;
    }
}

export default function AdminItemAdd() {
   
    const params = useParams<IAdminCategoryAddUrlParams>();
    const categoryId = params.cid;
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ category, setCategory ] = useState<ICategory>();
   
    const [ file, setFile ] = useState<File>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(AddItemFormReducer, {
        name: "",
        description: "",
       
      
    });

    



    const doAddCategory = () => {
        api("post", "/api/category/", "administrator", formState)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not add this category! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
            }

            return res.data;
        })
        .then(category => {
            if (!category?.categoryId) {
                throw new Error("Could not fetch new category data!");
            }

            return category;
        })
        .then(category => {
            if (!file) {
                throw new Error("No category photo selected!");
            }

            return {
                file,
                category
            };
        })
        .then(({ file, category }) => {
            const data = new FormData();
            data.append("image", file);
          
            return apiForm("post", "/api/category/" + category.categoryId +  "/photo", "administrator", data);
        })
        .then(res => {
            if (res.status !== "ok") {
               
                throw new Error("Could not upload category photo!");
            }

            return res.data;
        })
        .then(() => {
            navigate("/admin/dashboard/category/list", {
                replace: true,
            });
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

   

    return (
        <div>
            <Link className="btn btn-primary btn-sm" type="button" to="/admin/dashboard/category/list">
                &laquo; Back to category
            </Link>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Add new category</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                        <div className="form-group mb-3">
                            <label>Name</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={ formState.name }
                                    onChange={ e => dispatchFormStateAction({ type: "addItemForm/setName", value: e.target.value }) }
                                    />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Description</label>
                            <div className="input-group">
                                <textarea className="form-control form-control-sm" rows={ 5 }
                                    value={ formState.description }
                                    onChange={ e => dispatchFormStateAction({ type: "addItemForm/setDescription", value: e.target.value }) }
                                    />
                            </div>
                        </div>
                       

                        


                         <div className="form-froup mb-3">
                            <label>Category image</label>
                            <div className="input-group">
                                
                                <input type="file" accept=".jpg,.png" className="from-control form-control-sm"
                                     onChange={ e => {
                                        if (e.target.files) {
                                            setFile(e.target.files[0])
                                        }
                                     } }
                                />
                            </div>
                        </div>  

                        <div className="form-froup mb-3">
                            <button className="btn btn-primary" onClick={ () => doAddCategory() }>
                                Add Category
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}