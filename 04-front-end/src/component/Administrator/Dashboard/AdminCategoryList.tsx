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
                <td><img
                className="card-img-top"
                src={"http://localhost:10000/assets/" + props.category.photo_path}
                style={{ width: "100%", height: "10vh" }}
              /></td>
                
                <td>{props.category.categoryId}</td>
                <td>
                  {props.category.name}
                    </td>
                <td>
                {props.category.description}
                    
                    
                    </td>
                <td>
                
                <Link className="btn btn-primary btn-sm mb-1" to={"/admin/dashboard/category/edit/"+
                    props.category.categoryId}> Edit category</Link>
                    &nbsp;
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
                
                <Link className="btn btn-primary btn-sm" to={"/admin/dashboard/category/add"}> Add category</Link>
                
                
               <table className="table table-bordered table-striped table-hover table-sm" mt-3>
                   <thead>
                       <tr>
                           <th>Photo</th>
                           <th className="category-row-id">Id</th>
                           <th>Name</th>
                           <th>Description</th>
                           <th className="category-row-options">Options</th>
                       </tr>
                   </thead>
                   <tbody>
                       
                       {categories.map(category => <AdminCategoryListRow key={"category-row "+ category.categoryId} category={category} />)}
                   </tbody>
               </table> 
               </div>
        }
        
        </div>
    );
}

