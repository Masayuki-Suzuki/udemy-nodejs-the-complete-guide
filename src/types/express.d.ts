import Express, { Request } from 'express'
import { Session, SessionData } from 'express-session'
import { DocumentUser } from './models'

interface ICustomSessionType extends Partial<SessionData> {
    isLoggedIn: boolean
}

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

export type RequestWithCustomSession<body = unknown> = {
    session: ICustomSessionType
} & Request<unknown, unknown, body, unknown>
