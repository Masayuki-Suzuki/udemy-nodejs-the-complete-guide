import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { RequestWithCustomSession } from '../types/express'
import User from '../models/user'
import { DocumentUser } from '../types/models'
import { PostSignUpRequest } from '../types/controllers'
import { LoginBody } from '../types/auth'

export const getLoginPage = (
    req: RequestWithCustomSession,
    res: Response
): void => {
    res.render('shop/login', { title: 'Log In | Shops!', path: 'login' })
}

export const getSignUpPage = (req: Request, res: Response): void => {
    res.render('shop/signup', { title: 'Sign Up | Shops!', path: 'signup' })
}

export const postLogin = async (
    req: RequestWithCustomSession<LoginBody>,
    res: Response
): Promise<void> => {
    req.session.isLoggedIn = true

    const user = (await User.findOne({ email: req.body.email })) as DocumentUser

    if (user) {
        const isMatchPassword = await bcrypt
            .compare(req.body.password, user.password)
            .catch(err => {
                console.error(err)
                res.redirect('/login')
            })
        if (isMatchPassword) {
            req.session.user = user
            res.redirect('/')
        } else {
            req.session.user = null
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}

export const postLogOut = (
    req: RequestWithCustomSession,
    res: Response
): void => {
    req.session.destroy(err => {
        console.error(err)
    })
    res.redirect('/')
}

export const postSignUp = async (
    req: PostSignUpRequest,
    res: Response
): Promise<void> => {
    const { email, password, confirmPassword, firstName, lastName } = req.body
    const userDoc = await User.findOne({ email })

    const isValidPassword = password === confirmPassword

    if (!userDoc && isValidPassword) {
        const hashPassword = await bcrypt.hash(password, 16).catch(err => {
            console.error(err)
            res.redirect('/signup')
        })
        const user = new User({
            email,
            password: hashPassword,
            first_name: firstName,
            last_name: lastName,
            role: 'customer',
            cart: { items: [] }
        })

        await user.save()
        res.redirect('/')
    } else if (!isValidPassword) {
        res.redirect('/signup')
    } else {
        res.redirect('/login')
    }
}
