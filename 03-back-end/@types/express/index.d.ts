import IAdministratorTokenData from '../../src/components/auth/dto/IAdministratorTokenData';
declare global {
    namespace Express {
        interface Request {
            authorisation?:IAdministratorTokenData | null ;
            
        }
    }
}