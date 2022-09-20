import { faCheckSquare, faSquare, faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
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
    const reload = () => {
        api("get", "/api/category/" + categoryId + "/item/" + itemId, "administrator")
        .then(res => {
            if (res.status !== "ok") {

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

 

    function removePhoto() {
        api("delete", "/api/category/" + categoryId + "/item/" + itemId + "/photo/", "administrator")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not remove item photo!");
            }
        })
        .then(() => {
            setErrorMessage('');
            reload();
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Error removing file!");
        });
    }
    const fileInputRef = React.createRef<HTMLInputElement>();

    function uploadPhoto() {
        if (!fileInputRef.current?.files?.length) {
            return setErrorMessage('You must select a file to upload!');
        }
        const data = new FormData();
        data.append("image", fileInputRef.current?.files[0]);
        api("post", "/api/category/" + categoryId + "/item/" + itemId + "/photo/", "administrator",data)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not remove item photo!");
            }
        })
        .then(() => {
            setErrorMessage('');
            reload();
            (fileInputRef.current as HTMLInputElement).value = '';
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Error removing file!");
        });
    }

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
    
    // function removePhoto() {
    //     api("delete", "/api/category/" + params.categoryId + "/item/" + params.itemId + "/photo/", "administrator")
    //     .then(res => {
    //         if (res.status !== "ok") {
    //             throw new Error("Could not remove item photo!");
    //         }
    //     })
    //     .then(() => {
    //         setErrorMessage('');
            
    //     })
    //     .catch(error => {
    //         setErrorMessage(error?.message ?? "Error removing file!");
    //     });
    // }


    const doEditItem = () => {
        api("put", "/api/category/" + categoryId + "/item/"+itemId, "administrator", formState)
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
          
            return apiForm("post", "/api/category/" + categoryId + "/item/" + itemId + "/photo", "administrator", data);
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
        loadItem();
        reload();
        
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
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Edit item</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                        <div className="row">
                            <div className="col col-12 col-lg-7 mb-3 mb-lg-0">
                                <h2 className="h6">Manage item data</h2>

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
                                        Edit item
                                    </button>
                                </div>
                            </div>

                            <div className="col col-12 col-lg-5">
                                <h2 className="h6">Manage photos</h2>
                                
                                
                                     <div className="photos row mb-4">
                
                    <div className="col col-12 col-md-6 col-lg-4">
                        <div className="card">
                            <img className="card-img-top" src={"http://localhost:10000/assets/" +item?.photo_path} />

                            <div className="card-body">
                                <div className="card-text">
                                    <div className="d-grid">
                                        <button className="btn btn-danger w-100"
                                            onClick={ () => removePhoto( )}>
                                            <FontAwesomeIcon icon={ faSquareMinus } /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>    
                        </div>
                    </div>
                
            </div>

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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}