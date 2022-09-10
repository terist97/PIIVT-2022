import { useEffect, useState } from 'react';
import ICategory from "../../../../models/ICategory.model";
import { api } from "../../../../api/api";
import { Link,useParams} from 'react-router-dom';
import UserCategoryPage from "../UserCategoryPage/UserCategoryPage";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
export interface IUserItemListUrlParams extends Record <string, string | undefined > {
    cid:string
}

export default function UserCategoryList() {
    const [ categories, setCategories ] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const params = useParams<IUserItemListUrlParams>();
    const categoryId = params.cid;
    

    const loadCategories= () =>{
        api("get", "/api/category/", "administrator")
        .then (apiResponse=> {
            if (apiResponse.status !== "ok") {
                throw new Error("Could not load this category!");
            }

            return apiResponse.data;
        })
        .then (categories => {
            setCategories(categories);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });

    };

     useEffect(loadCategories,[])
     return (
        <div>
        
     
                                    

{categories.map(category => (



<Card style={{ width: '20rem', display:"inline-block" ,margin:"20px" }}>
<Link className="nav-item nav-link active" to={"/category/" + category.categoryId}>
<Card.Img variant="top" src={"http://localhost:10000/assets/" +category.photo_path}
                                     />
<Card.Body>
  <Card.Title style={{textAlign:"center"}}>{category.name}</Card.Title>
  <Card.Text>
    
  </Card.Text>
</Card.Body>
<ListGroup className="list-group-flush">
  <ListGroup.Item>{category.description}</ListGroup.Item>
  
</ListGroup>
</Link>
</Card>

  



))}
         </div>
        
            );
        }