import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import IItem from "../../../models/IItemModel";


export interface IAdminItemEditUrlParams extends Record<string, string | undefined> {
    cid: string
    iid:string
}

interface IEditItemFormState {
    name: string;
    description: string;
    price:number;
    isActive: boolean;
  
};

type TSetName          = { type: "editItemForm/setName",          value: string };
type TSetDescription   = { type: "editItemForm/setDescription",   value: string };
type TSetPrice         = { type: "editItemForm/setPrice",         value: number };
type TToggleIsActive   = { type: "editItemForm/toggleIsActive" };

type AddItemFormAction = TSetName
                       | TSetDescription
                       | TSetPrice
                       | TToggleIsActive;
                     

function EditItemFormReducer(oldState: IEditItemFormState, action: AddItemFormAction): IEditItemFormState {
    switch (action.type) {
        case "editItemForm/setName": {
            return {
                ...oldState,
               
                name: action.value,
            }
        }

        case "editItemForm/setDescription": {
            return {
                ...oldState,
               
                description: action.value,
            }
        }
        case "editItemForm/setPrice": {
            return {
                ...oldState,
               
                price: action.value,
            }
        }

        case "editItemForm/toggleIsActive": {
            return {
                ...oldState,
                
                isActive: !oldState.isActive,
            }
        }

        

        default: return oldState;
    }
}

export default function AdminItemEdit() {
    const params = useParams<IAdminItemEditUrlParams>();
    const categoryId = params.cid;
    const itemId = params.iid;

    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ category, setCategory ] = useState<ICategory>();
    const [item, setItem ] = useState<IItem>();
   
    const [ file, setFile ] = useState<File>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(EditItemFormReducer, {
        name: "",
        description: "",
        price:0,
        isActive: false,
      
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

    const loadItem = () => {
        api("get", "/api/category/" + categoryId + "/item/" + itemId, "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load this item!");
            }

            return res.data;
        })
        .then(item => {
            setItem(item);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };


    const doEditItem = () => {
        api("put", "/api/category/" + categoryId + "/item"+itemId, "administrator", formState)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not edit this item! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
            }

            return res.data;
        })
        .then(item => {
            if (!item?.itemId) {
                throw new Error("Could not fetch the edited item data!");
            }

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
        loadItem();
        
    }, [ params.cid, params.iid, ]);

    useEffect(() => {
        dispatchFormStateAction({ type: "editItemForm/setName", value: item?.name ?? '' });
        dispatchFormStateAction({ type: "editItemForm/setDescription", value: item?.description ?? '' });
        dispatchFormStateAction({ type: "editItemForm/setPrice", value: item?.price ?? 0 });

        if (item?.isActive) {
            dispatchFormStateAction({ type: "editItemForm/toggleIsActive" });
        }
    }, [ item ]);

    return (
        <div>
            <Link className="btn btn-primary btn-sm" type="button" to="/admin/dashboard/category/list">
                &laquo; Back to category
            </Link>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Edit this item</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                        <div className="form-group mb-3">
                            <label>Name</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                    value={ formState.name }
                                    onChange={ e => dispatchFormStateAction({ type: "editItemForm/setName", value: e.target.value }) }
                                    />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Description</label>
                            <div className="input-group">
                                <textarea className="form-control form-control-sm" rows={ 5 }
                                    value={ formState.description }
                                    onChange={ e => dispatchFormStateAction({ type: "editItemForm/setDescription", value: e.target.value }) }
                                    />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label>Price</label>
                            <div className="input-group">
                                <textarea className="form-control form-control-sm" rows={ 5 }
                                    value={ formState.price }
                                    onChange={ e => dispatchFormStateAction({ type: "editItemForm/setPrice", value: Number(e.target.value) }) }
                                    />
                            </div>
                        </div>
                    

                        


                        <div className="form-froup mb-3">
                            <label>Status</label>
                            <div className="input-group">

                                <div onClick={ () => dispatchFormStateAction({ type: "editItemForm/toggleIsActive" }) }>
                                    <FontAwesomeIcon icon={ formState.isActive ? faCheckSquare : faSquare } /> { formState.isActive ? "Active" : "Inactive" }
                                </div>
                            </div>
                        </div>

                        <div className="form-froup mb-3">
                            <button className="btn btn-primary" onClick={ () => doEditItem() }>
                                Edit Item
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}