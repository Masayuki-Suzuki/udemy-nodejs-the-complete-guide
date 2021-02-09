import { Response } from 'express'
import bcrypt from 'bcryptjs'
import { CustomRequest, RequestWithCustomSession } from '../types/express'
import User from '../models/user'
import { DocumentUser } from '../types/models'
import { PostSignUpRequest } from '../types/controllers'
import { LoginBody } from '../types/auth'
import getFlashErrorMessage from '../utils/getFlashErrorMessage'

export const getLoginPage = (req: CustomRequest, res: Response): void => {
    res.render('shop/login', {
        title: 'Log In | Shops!',
        path: 'login',
        errorMessage: getFlashErrorMessage(req)
    })
}

export const getSignUpPage = (req: CustomRequest, res: Response): void => {
    res.render('shop/signup', {
        title: 'Sign Up | Shops!',
        path: 'signup',
        errorMessage: getFlashErrorMessage(req)
    })
}

export const postLogin = async (
    req: RequestWithCustomSession<LoginBody>,
    res: Response
): Promise<void> => {
    const user = (await User.findOne({ email: req.body.email })) as DocumentUser

    if (user) {
        const isMatchPassword = await bcrypt
            .compare(req.body.password, user.password)
            .catch(err => {
                console.error(err)
                req.session.user = null
                req.flash('error', 'Invalid email or password.')
                res.redirect('/login')
            })
        if (isMatchPassword) {
            req.session.isLoggedIn = true
            req.session.user = user
            res.redirect('/')
        } else {
            req.session.user = null
            req.flash('error', 'Invalid email or password.')
            res.redirect('/login')
        }
    } else {
        req.flash('error', 'Invalid email or password.')
        res.redirect('/login')
    }
}

export const postLogOut = (
    req: RequestWithCustomSession,
    res: Response
): void => {
    req.session.isLoggedIn = false
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

    if (!email.length) {
        req.flash('error', 'Email address is empty')
        res.redirect('/signup')
    } else if (!(firstName.length && lastName.length)) {
        req.flash('error', 'First Name and/or Last Name is empty.')
        res.redirect('/signup')
    } else if (!(password.length && confirmPassword.length)) {
        req.flash('error', 'Password is empty.')
        res.redirect('/signup')
    } else {
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
            req.session.user = user
            req.session.isLoggedIn = true

            res.redirect('/')
        } else if (!userDoc && !isValidPassword) {
            req.flash('error', 'Do not match passwords.')
            res.redirect('/signup')
        } else {
            req.flash('error', 'Email address has already been taken.')
            res.redirect('/signup')
        }
    }
}
