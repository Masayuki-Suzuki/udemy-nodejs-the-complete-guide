import { Request, Response } from 'express'

export const getPageNotFound = (req: Request, res: Response): void => {
    res.status(404).render('404', { title: 'Page Not Found' })
}

export default { getPageNotFound }
