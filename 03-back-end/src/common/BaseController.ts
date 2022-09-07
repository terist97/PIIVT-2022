import { IServices } from './IApplicationResources.interface';
export default abstract class BaseController {

    private serviceinstances: IServices;

    constructor(services: IServices) {
        this.serviceinstances = services;
    }

    protected get services(): IServices {
        return this.serviceinstances;
    }

}