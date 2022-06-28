import {Link, useParams} from "react-router-dom";
import { useEffect, useState } from 'react';
import IItem from "../../../models/IItemModel";
import { api } from "../../../api/api";
import { faCheckSquare, faEdit, faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IAdminItemListUrlParams extends Record <string, string | undefined > {
    cid:string
}

export default function AdminItemList(){
    const params = useParams<IAdminItemListUrlParams>();
    const categoryId = params.cid;

    const [ items, setItems ]= useState<IItem[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");


    const loadItems= () =>{
        api("get", "/api/category/" + categoryId + "/item", "administrator")
        .then (res=> {
            if (res.status !== "ok") {
                throw new Error("Could not load this category!");
            }

            return res.data;
        })
        .then (items => {
            setItems(items);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });

    };

    useEffect(loadItems,[])



    return (

        <div className="card">
        <div className="card-body">
            <div className="card-title">
                <h1 className="h5">List of category items</h1>
            </div>
            <div className="card-text">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                        <th>Photo</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>State</th>
                        <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length ===0 && 
                        <tr><td colSpan={7}>No items</td></tr>}

                        {items.map(item=> (
                            <tr key={"item-" + item.itemId}>
                                <td>
                                   
                                    <img alt={item.name} 
                                    src={"http://localhost:10000/assets/" +item.photo_path}
                                    style={{width:"150px"}} />

                                               
                                </td>

                                <td>
                                   {item.itemId} 
                                </td>
                                <td>
                                   {item.name} 
                                </td>
                                <td>
                                    {

                                        item.isActive 
                                        ?<><FontAwesomeIcon icon={faCheckSquare} /> Active</>
                                        :<><FontAwesomeIcon icon={faSquare} /> Inactive</>
                                    

                                    }
                                </td>
                                <td>
                                <Link to={ "/admin/dashboard/category/" + params.cid + "/items/edit/" + item.itemId }
                                            className="btn btn-sm btn-primary">
                                            <FontAwesomeIcon icon={ faEdit } /> Edit
                                        </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
               
            </div>
        </div>
    </div>

    );
}