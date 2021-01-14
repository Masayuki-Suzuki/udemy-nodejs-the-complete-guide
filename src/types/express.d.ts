import Express, { Request } from 'express'
import { User, UserModel } from './models'
import { Nullable } from './utilities'

declare global {
    namespace Express {
        export interface Request {
            user: Nullable<User>
        }
    }
}

export interface RequestWithUserModel extends Request<any, any, any, any> {
    user: Nullable<User>
}
