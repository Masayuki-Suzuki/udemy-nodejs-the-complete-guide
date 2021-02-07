import Express, { Request } from 'express'
import { Session, SessionData } from 'express-session'
import { DocumentUser } from './models'

interface ICustomSessionType extends Partial<SessionData> {
    isLoggedIn: boolean
}

declare module 'express-session' {
    interface SessionData {
        isLoggedIn: boolean
        user: DocumentUser | null
    }
}

declare global {
    namespace Express {
        export interface Request {
            user: DocumentUser | null
            session: Session & Partial<SessionData>
        }
    }
}

export type RequestWithUserModel<body = unknown> = {
    user: DocumentUser | null
} & Request<unknown, unknown, body, unknown>

export type RequestWithCustomSession<body = unknown> = {
    session: ICustomSessionType & Session
} & Request<unknown, unknown, body, unknown>
