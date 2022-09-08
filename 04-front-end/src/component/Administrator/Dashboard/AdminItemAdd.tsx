import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";


export interface IAdminItemAddUrlParams extends Record<string, string | undefined> {
    cid: string
}

interface IAddItemFormState {
    name: string;
    description: string;
    price:number;
  
};

type TSetName          = { type: "addItemForm/setName",          value: string };
type TSetDescription   = { type: "addItemForm/setDescription",   value: string };
type TSetPrice         = { type: "addItemForm/setPrice",         value: number };

type AddItemFormAction = TSetName
                       | TSetDescription
                       | TSetPrice
                     

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
        case "addItemForm/setPrice": {
            return {
                ...oldState,
               
                price: action.value,
            }
        }

        

        default: return oldState;
    }
}

export default function AdminItemAdd() {
    const params = useParams<IAdminItemAddUrlParams>();
    const categoryId = params.cid;

    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ category, setCategory ] = useState<ICategory>();
   
    const [ file, setFile ] = useState<File>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(AddItemFormReducer, {
        name: "",
        description: "",
        price:0,
      
    });

    const loadCategory = () => {
        api("get", "/api/category/" + categoryId, "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load this category!");
            }

            return res.data;
        })
        .then(category => {
            setCategory(category);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };


    const doAddItem = () => {
        api("post", "/api/category/" + categoryId + "/item", "administrator", formState)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not add this item! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
            }

            return res.data;
        })
        .then(item => {
            if (!item?.itemId) {
                throw new Error("Could not fetch new item data!");
            }

            return item;
        })
        .then(item => {
            if (!file) {
                throw new Error("No item photo selected!");
            }

            return {
                file,
                item
            };
        })
        .then(({ file, item }) => {
            const data = new FormData();
            data.append("image", file);
          
            return apiForm("post", "/api/category/" + categoryId + "/item/" + item?.itemId + "/photo", "administrator", data);
        })
        .then(res => {
            if (res.status !== "ok") {
               
                throw new Error("Could not upload item photo!");
            }

            return res.data;
        })
        .then(() => {
            navigate("/admin/dashboard/category/" + categoryId + "/items/list", {
                replace: true,
            });
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    useEffect(() => {
        loadCategory();
        
    }, [ params.cid ]);

    return (
        <div>
            <Link className="btn btn-primary btn-sm" type="button" to="/admin/dashboard/category/list">
                &laquo; Back to category
            </Link>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Add new item</h1>
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
                        <div className="form-group mb-3">
                            <label>Price</label>
                            <div className="input-group">
                                <textarea className="form-control form-control-sm" rows={ 5 }
                                    value={ formState.price }
                                    onChange={ e => dispatchFormStateAction({ type: "addItemForm/setPrice", value: Number(e.target.value) }) }
                                    />
                            </div>
                        </div>

                        


                        <div className="form-froup mb-3">
                            <label>Item image</label>
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
                            <button className="btn btn-primary" onClick={ () => doAddItem() }>
                                Add item
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}