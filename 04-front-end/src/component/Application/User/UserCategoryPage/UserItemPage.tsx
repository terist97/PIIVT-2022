import { useEffect, useState } from "react";
import ICategory from "../../../../models/ICategory.model";
import IItem from "../../../../models/IItemModel";
import ItemPreview from "../Item/ItemPreview";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../../api/api";
import MyCartStore from "../../../../stores/MyCartStore";

export interface IUserItemPageUrlParams
    extends Record<string, string | undefined> {
    id: string;
    iid: string;
}

export interface IUserItemProperties {
    categoryId?: number;
    itemId?: number;
}

export default function UserItemPage(props: IUserItemProperties) {
    const [item, setItem] = useState<IItem>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [cartState, setCartState] = useState(MyCartStore.getState())

    const params = useParams<IUserItemPageUrlParams>();

    const categoryId = props?.categoryId ?? params.id;
    const itemId = props?.itemId ?? params.iid;


    const isAlreadyInCart = () => {
        if (!cartState || !cartState.items) return false
        console.log(cartState.items)
        const foundItem = cartState.items.find((cartItem) => cartItem.itemId === item?.itemId)
        console.log(foundItem)
        return foundItem !== undefined
    }

    const [isAddedToCart, setIsAddedToCart] = useState(false)

    useEffect(() => {
        const _isAlreadyInCart = isAlreadyInCart()

        console.log("from useeffect value is ", _isAlreadyInCart)
        setIsAddedToCart(_isAlreadyInCart)
    }, [cartState,item])

    const handleAddToCart = (item?: IItem) => {
        if (!item) return
        setIsAddedToCart(true)
        MyCartStore.dispatch({ type: "add_to_cart", value: item });
    };

    const handleRemoveFromCart = (item?: IItem) => {
        if (!item) return
        setIsAddedToCart(false)
        MyCartStore.dispatch({ type: "remove_from_cart", value: item });
    }
    console.log("Is added to cart value: ", isAddedToCart)

    useEffect(() => {
        setLoading(true);
        api(
            "get",
            "/api/category/" + categoryId + "/item/" + itemId,
            "administrator"
        ).then((response) => {
            setItem(response.data as IItem);
        }).finally(() => {
            setLoading(false);
        })
    }, [categoryId, itemId]);



    return (
        <div>


            <img
                className="card-img-top"
                src={"http://localhost:10000/assets/" + item?.photo_path}
                style={{ width: "40%" }}
                alt="asset"
            />
            <div style={{ margin: "20px" }}>
                {isAddedToCart &&
                    <button
                        className="btn btn-primary"
                        onClick={() => handleRemoveFromCart(item)}
                    >
                        Izbaci iz korpe
                    </button>
                }
                {!isAddedToCart &&
                    <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(item)}
                    >
                        Dodaj u korpu
                    </button>
                }
            </div>

            <div>
                <h4 className="card-title">Ime proizvoda je: {item?.name}</h4>

                <p className="card-text">Cena ovog artikla je: {item?.price}</p>
                <p className="card-text">Opis ovog artikla: {item?.description}</p>
            </div>
        </div>

    );
}