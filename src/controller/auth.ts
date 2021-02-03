import { Request, Response } from 'express'
import { RequestWithCustomSession } from '../types/express'
import User from '../models/user'
import { DocumentUser, UserWithCart } from '../types/models'

export const getLoginPage = (
    req: RequestWithCustomSession,
    res: Response
): void => {
    // const rawCookieStr = (req.get('Cookie') as string) || ''
    // console.log(rawCookieStr)
    // if (rawCookieStr) {
    //     const isLoggedIn = rawCookieStr.match(/loggedIn=true$/g) || ''
    //     console.log(isLoggedIn[0].split('=')[1])
    // }

    res.render('shop/login', { title: 'Log In | Shops!' })
}

export const postLogin = async (
    req: RequestWithCustomSession,
    res: Response
): Promise<void> => {
    req.session.isLoggedIn = true

    const user = (await User.findById(
        '600528241f408ff2d4837824'
    )) as DocumentUser

    if (!user) {
        req.session.user = new User({
            first_name: 'Masayuki',
            last_name: 'Suzuki',
            email: 'example@example.com',
            role: 'admin',
            cart: {
                items: []
            }
        })
    } else {
        req.session.user = user
    }

    res.redirect('/')
}

export const postLogOut = (req, res): void => {
    req.session.destroy(err => {
        console.error(err)
    })
    res.redirect('/')
}
