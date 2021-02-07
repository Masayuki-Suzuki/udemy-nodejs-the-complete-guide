import { Response, NextFunction } from 'express'
import { RequestWithCustomSession } from '../types/express'

export const authenticated = (
    req: RequestWithCustomSession,
    res: Response,
    next: NextFunction
): void => {
    if (!req.session.isLoggedIn) {
        res.status(401).redirect('/login')
    }
    next()
}

export const isAdminUser = (
    req: RequestWithCustomSession,
    res: Response,
    next: NextFunction
): void => {
    const { isLoggedIn, user } = req.session

    if (!isLoggedIn || !user) {
        res.status(401).redirect('/login')
    } else if (user && !(user.role === 'admin' || user.role === 'root')) {
        res.status(401).redirect('/')
    } else {
        next()
    }
}
