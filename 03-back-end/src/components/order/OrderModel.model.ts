import IModel from "../../common/IModel.inteface";
export default class ItemModel implements IModel {

    orderId: number;
    forename: string;
    surname: string;
    email: string;
    address?: string;
    createdAt: string;







}
