import { useEffect, useState } from "react";
import ICategory from "../../../../models/ICategory.model";
import IItem from "../../../../models/IItemModel";
import ItemPreview from "../Item/ItemPreview";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../../api/api";


export interface IUserItemPageUrlParams extends Record<string, string | undefined> {
    id: string
    iid:string
}

export interface IUserCategoryProperties {
    categoryId?: number;
    itemId?:number;
}

export default function UserCategoryPage(props: IUserCategoryProperties) {
    const [ category, setCategory ]         = useState<ICategory|null>(null);
    const [ items, setItems ]               = useState<IItem[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ loading, setLoading ]           = useState<boolean>(false);

    const params = useParams<IUserItemPageUrlParams>();

    const categoryId = props?.categoryId ?? params.id;
    const itemId = props?.itemId ?? params.iid;

    useEffect(() => {
        setLoading(true);

        api("get", "/api/category/" + categoryId, "administrator")
        .then(res => {
            if (res.status === 'error') {
                throw new Error('Could not get category data!');
            }

            setCategory(res.data);
        })
        .then(() => {
            return api("get", "/api/category/" + categoryId + "/item", "administrator")
        })
        .then(res => {
            if (res.status === 'error') {
                throw new Error('Could not get category items!');
            }

            setItems(res.data);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading this category!');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [ categoryId ]);

    if (items.length === 0) {
        return null;
    }

    return (
       <div>
           

                
                
                
                


  <img className="card-img-top" 
src={"http://localhost:10000/assets/" +items[0].photo_path}
style={{width:"40%"}}/>
<div style={{margin:"20px"}}>   <a href="#" className="btn btn-primary">Dodaj u korpu</a></div>
 
  <div >
    <h4 className="card-title">Ime proizvoda je: {items[0].name}</h4>

    <p className="card-text">Cena ovog artikla je:  {items[0].price}</p>
    <p className="card-text">Opis ovog artikla:  {items[0].description}</p>

  
  </div>
  
                                                              



       </div>
                
            
       
    );
}