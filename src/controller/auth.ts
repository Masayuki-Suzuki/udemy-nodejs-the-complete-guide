import { Request, Response } from 'express'

export const getLoginPage = (req: Request, res: Response): void => {
    res.render('shop/login', { title: 'Log In | Shops!' })
}

export const postLogin = (req: Request, res: Response): void => {
    req.isLoggedIn = true
    res.redirect('/')
}
