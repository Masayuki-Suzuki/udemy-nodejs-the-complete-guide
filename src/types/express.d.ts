import Express, { Request } from 'express'
import { UserModel, UserWithCart } from './models'
import { Nullable } from './utilities'
import { User } from '../models/user'

declare global {
    namespace Express {
        export interface Request {
            user: User | null
        }
    }
}

export interface RequestWithUserModel<body = unknown>
    extends Request<unknown, unknown, body, unknown> {
    user: User | null
}
