import { useEffect, useState } from 'react';
import ICategory from "../../../../models/ICategory.model";
import { api } from "../../../../api/api";
import { Link } from 'react-router-dom';
import UserCategoryPage from "../UserCategoryPage/UserCategoryPage";

export default function UserCategoryList() {
    const [ categories, setCategories ] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {
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
    }, [ ]);
    return (
        <div>

            {errorMessage && (<p>Error: {errorMessage}</p>)}
            {!errorMessage && 
        
        <ul>

            {categories.map(category => (
                <li key={"category-" + category.categoryId}>
                    <Link to={"/category/" + category.categoryId}>{category.name}</Link>
                        
                </li>
            ))}

        </ul>
        }
        
        </div>
    );
}