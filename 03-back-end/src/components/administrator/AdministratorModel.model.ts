
import IModel from '../../common/IModel.inteface';


export default class AdministratorModel implements IModel {
    administratorId: number;
    username: string;
    passwordHash?: string;
    createdAt: string;
    isActive: boolean;
}
