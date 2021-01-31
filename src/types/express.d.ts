import Express, { Request } from 'express'
import { DocumentUser } from './models'

declare global {
    namespace Express {
        export interface Request {
            user: DocumentUser | null
            isLoggedIn: boolean
        }
    }
}

export interface RequestWithUserModel<body = unknown>
    extends Request<unknown, unknown, body, unknown> {
    user: DocumentUser | null
}
