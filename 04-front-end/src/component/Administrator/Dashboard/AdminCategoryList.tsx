import { useState, useEffect } from "react";
import { api } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";

import { Link } from "react-router-dom";
import './AdminCategoryList.sass';


interface IAdminCategorListRowProperties{
    category:ICategory,
}

export default function AdminCategoryList(){
    const [ categories, setCategories ] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [showAddNewCategory, setShowAddNewCategory] = useState<boolean>(false);

    function AdminCategoryListRow(props:IAdminCategorListRowProperties){
        const [name,setName] = useState<string>(props.category.name);
        const [description,setDescription] = useState<string>(props.category.description);
        
        
        const nameChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        }
        const descriptionChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
            setDescription(e.target.value);
        }


        const doEditCategory = (e:any) => {
            api("put", "/api/category"+"/"+ props.category.categoryId,"administrator",{
                name
            })
            .then(res => {
                if(res.status ==='error'){
                   return  setErrorMessage("Could not edit this category!")
                }
                loadCategories();


            })
        }

        const doEditCategory2 = (e:any) => {
            api("put", "/api/category"+"/"+ props.category.categoryId,"administrator",{
                description
            })
            .then(res => {
                if(res.status ==='error'){
                   return  setErrorMessage("Could not edit this category!")
                }
                loadCategories();


            })
        }
        return (
            <tr>
                <td>{props.category.categoryId}</td>
                <td>
                    <div className="input-group">
                    <input className="form-control form-control-sm"
                    type="text"
                    value={name}
                    onChange={e => nameChanged(e)} />
                    {props.category.name !== name ? <button 
                    className="btn btn-primary btn-sm"
                    onClick={e => doEditCategory(e)}>
                        Save
                    </button> : ''}
                    
                    </div>
                    </td>
                <td>
                <div className="input-group">
                    <input className="form-control form-control-sm"
                    type="text"
                    value={description}
                    onChange={e => descriptionChanged(e)} />
                    {props.category.description !== description ? <button 
                    className="btn btn-primary btn-sm"
                    onClick={e => doEditCategory2(e)}>
                        Save
                    </button> : ''}
                    
                    </div>
                    
                    
                    </td>
                <td>
                    <Link className="btn btn-primary btn-sm" to={"/admin/dashboard/category/"+
                    props.category.categoryId + "/items/list"}> List items</Link>
                    &nbsp;

                    <Link className="btn btn-primary btn-sm" to={"/admin/dashboard/category/"+
                    props.category.categoryId + "/items/add"}> Add item</Link>
                </td>
            </tr>
        );
    }

    function AdminCategoryAddRow(){
        const [name,setName] = useState<string>("");
        const [description,setDescription] = useState<string>("");
        
        
        const nameChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        }
        const descriptionChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
            setDescription(e.target.value);
        }


        const doAddCategory = (e:any) => {
            api("post", "/api/category","administrator",{
                name,description
            })
            .then(res => {
                if(res.status ==='error'){
                   return  setErrorMessage("Could not add this category!")
                }
                loadCategories();
                setName("");
                setDescription("");
                setShowAddNewCategory(false);

            })
        }

       
        return (
            <tr>
                <td></td>
                <td>
                    <div className="input-group">
                    <input className="form-control form-control-sm"
                    type="text"
                    value={name}
                    onChange={e => nameChanged(e)} />
                    {name.trim().length >=4 && name.trim().length <=32 ?<button 
                    className="btn btn-primary btn-sm"
                    onClick={e => doAddCategory(e)}>
                        Save
                    </button> : ''}
                    
                    </div>
                    </td>
                <td>
                 <div className="input-group">
                    <input className="form-control form-control-sm"
                    type="text"
                    value={description}
                    onChange={e => descriptionChanged(e)} />
                    {description.length >=30 ? <button 
                    className="btn btn-primary btn-sm"
                    onClick={e => doAddCategory(e)}>
                        Save
                    </button> : ''}
                    
                    </div> 
                    
                    
                    </td>
                <td>
                   <button className="btn btn-danger btn-sm" onClick={() => {
                       setShowAddNewCategory(false);
                       setName("");
                       setDescription("");
                   }}>
                       Cancel
                   </button>
                </td>
            </tr>
        );
    }
    const loadCategories=()=>{
        api("get", "/api/category", "administrator")
        .then(apiResponse => {
            if (apiResponse.status === 'ok') {
                return setCategories(apiResponse.data);
            }

            throw new Error('Unknown error while loading categories...');
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading categories...');
        });
    }

    useEffect(() => {
        loadCategories();
      
    }, [ ]);
    return (
        <div>

            {errorMessage && (<p>Error: {errorMessage}</p>)}
            {!errorMessage && 
            <div>
                <button className="btn btn-primary btn-sm" onClick={()=>setShowAddNewCategory(true)}>Add new category </button>
        
               <table className="table table-bordered table-striped table-hover table-sm" mt-3>
                   <thead>
                       <tr>
                           <th className="category-row-id">Id</th>
                           <th>Name</th>
                           <th>Description</th>
                           <th className="category-row-options">Options</th>
                       </tr>
                   </thead>
                   <tbody>
                       {showAddNewCategory && <AdminCategoryAddRow /> }
                       {categories.map(category => <AdminCategoryListRow key={"category-row "+ category.categoryId} category={category} />)}
                   </tbody>
               </table> 
               </div>
        }
        
        </div>
    );
}

