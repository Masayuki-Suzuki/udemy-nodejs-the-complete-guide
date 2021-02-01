import { Request, Response } from 'express'
import { RequestWithCustomSession } from '../types/express'

export const getLoginPage = (req: Request, res: Response): void => {
    // const rawCookieStr = (req.get('Cookie') as string) || ''
    // console.log(rawCookieStr)
    // if (rawCookieStr) {
    //     const isLoggedIn = rawCookieStr.match(/loggedIn=true$/g) || ''
    //     console.log(isLoggedIn[0].split('=')[1])
    // }
    console.log(req.session)

    res.render('shop/login', { title: 'Log In | Shops!' })
}

export const postLogin = (
    req: RequestWithCustomSession,
    res: Response
): void => {
    req.session.isLoggedIn = true
    res.redirect('/')
}
