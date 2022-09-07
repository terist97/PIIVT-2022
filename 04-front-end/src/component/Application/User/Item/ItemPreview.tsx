import IItem from "../../../../models/IItemModel";

export interface IItemPreviewProperties{

    item:IItem;

}
export default function ItemPreview(props:IItemPreviewProperties){

    return(

            <div>
                <h2>{props.item.name}</h2>
                <p>{props.item.description}</p>
                <p>{props.item.price}</p>
            </div>

    );
}