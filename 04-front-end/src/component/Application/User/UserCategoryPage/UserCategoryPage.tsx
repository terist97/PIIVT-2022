import { useEffect, useState } from "react";
import ICategory from "../../../../models/ICategory.model";
import IItem from "../../../../models/IItemModel";
import ItemPreview from "../Item/ItemPreview";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../../api/api";

export interface IUserCategoryPageUrlParams
  extends Record<string, string | undefined> {
  id: string;
}

export interface IUserCategoryProperties {
  categoryId?: number;
}

export default function UserCategoryPage(props: IUserCategoryProperties) {
  const [category, setCategory] = useState<ICategory | null>(null);
  const [items, setItems] = useState<IItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams<IUserCategoryPageUrlParams>();

  const categoryId = props?.categoryId ?? params.id;

  useEffect(() => {
    setLoading(true);

    api("get", "/api/category/" + categoryId, "administrator")
      .then((res) => {
        if (res.status === "error") {
          throw new Error("Could not get category data!");
        }

        setCategory(res.data);
      })
      .then(() => {
        return api(
          "get",
          "/api/category/" + categoryId + "/item",
          "administrator"
        );
      })
      .then((res) => {
        if (res.status === "error") {
          throw new Error("Could not get category items!");
        }

        setItems(res.data);
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading this category!"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      {items.map((item) => (
        <div>
          <div className="card" style={{ width: "500px", margin: "15px" }}>
            <Link
              className="nav-item nav-link active"
              to={"/category/" + category?.categoryId + "/item/" + item.itemId}
            >
              <img
                className="card-img-top"
                src={"http://localhost:10000/assets/" + item.photo_path}
                style={{ width: "100%", height: "20vh" }}
              />

              <div className="card-body">
                <h4 className="card-title">{item.name}</h4>

                <p className="card-text">{item.price}</p>
                
                
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}