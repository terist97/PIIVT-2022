import { faCheckSquare, faSquare, faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import IItem from "../../../models/IItemModel";


export interface IAdminCategoryEditUrlParams extends Record<string, string | undefined> {
    cid: string
   
}

interface IEditCategoryFormState {
    name: string;
    description: string;
   
  
};

type TSetName          = { type: "editCategoryForm/setName",          value: string };
type TSetDescription   = { type: "editCategoryForm/setDescription",   value: string };


type AddCategoryFormAction = TSetName
                       | TSetDescription;
                      
                     

function EditCategoryFormReducer(oldState: IEditCategoryFormState, action: AddCategoryFormAction): IEditCategoryFormState {
    switch (action.type) {
        case "editCategoryForm/setName": {
            return {
                ...oldState,
               
                name: action.value,
            }
        }

        case "editCategoryForm/setDescription": {
            return {
                ...oldState,
               
                description: action.value,
            }
        }
       

        

        default: return oldState;
    }
}

export default function AdminCategoryEdit() {
    const params = useParams<IAdminCategoryEditUrlParams>();
    const categoryId = params.cid;
   

    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ category, setCategory ] = useState<ICategory>();
    
   
   
    const [ file, setFile ] = useState<File>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(EditCategoryFormReducer, {
        name: "",
        description: "",
       
      
    });
    const reload = () => {
        api("get", "/api/category/" + categoryId, "administrator")
        .then(res => {
            if (res.status !== "ok") {

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


 

    function removePhoto() {
        api("delete", "/api/category/" + categoryId + "/photo/", "administrator")
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
        api("post", "/api/category/" + categoryId +  "/photo/", "administrator",data)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not remove category photo!");
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

   
    
   


    const doEditCategory = () => {
        api("put", "/api/category/" + categoryId ,  "administrator",formState )
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not edit this category! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
            }

            return res.data;
        })
        .then(category => {
            if (!category?.categoryId) {
                throw new Error("Could not fetch the edited category data!");
            }

        })
        
        // .then(({ file }) => {
        //     const data = new FormData();
        //     data.append("image", file);
          
        //     return apiForm("post", "/api/category/" + categoryId +  "/photo", "administrator", data);
        // })
        // .then(res => {
        //     if (res.status !== "ok") {
               
        //         throw new Error("Could not upload item photo!");
        //     }

        //     return res.data;
        // })
        .then(() => {
            navigate("/admin/dashboard/category/list", {
                replace: true,
            });
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };
        
    useEffect(() => {
        loadCategory(); 
        reload();
        
    }, [ params.cid ]);

    useEffect(() => {
        dispatchFormStateAction({ type: "editCategoryForm/setName", value: category?.name ?? '' });
        dispatchFormStateAction({ type: "editCategoryForm/setDescription", value: category?.description ?? '' });
        
    }, [ category]);

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Edit category</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                        <div className="row">
                            <div className="col col-12 col-lg-7 mb-3 mb-lg-0">
                                <h2 className="h6">Manage category data</h2>

                                <div className="form-group mb-3">
                                    <label>Name</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control form-control-sm"
                                            value={ formState.name }
                                            onChange={ e => dispatchFormStateAction({ type: "editCategoryForm/setName", value: e.target.value }) }
                                            />
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label>Description</label>
                                    <div className="input-group">
                                        <textarea className="form-control form-control-sm" rows={ 5 }
                                            value={ formState.description }
                                            onChange={ e => dispatchFormStateAction({ type: "editCategoryForm/setDescription", value: e.target.value }) }
                                            />
                                    </div>
                                </div>
                               

                               

                                <div className="form-froup mb-3">
                               

                                </div>

                               

                                <div className="form-froup mb-3">
                                    <button className="btn btn-primary" onClick={ () => doEditCategory() }>
                                        Edit item
                                    </button>
                                </div>
                            </div>

                            <div className="col col-12 col-lg-5">
                                <h2 className="h6">Manage photos</h2>
                                
                                
                                     <div className="photos row mb-4">
                
                                     <div className="col col-12 col-md-6 col-lg-4">
                        <div className="card">
                            <img className="card-img-top" src={"http://localhost:10000/assets/" +category?.photo_path} />

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