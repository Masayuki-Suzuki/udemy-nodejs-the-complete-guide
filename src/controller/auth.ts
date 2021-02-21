import crypto from 'crypto'
import { Request, Response } from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid-transport'
import User from '../models/user'
import getFlashErrorMessage from '../utils/getFlashErrorMessage'
import { CustomRequest, RequestWithCustomSession } from '../types/express'
import { DocumentUser, UserWithCart } from '../types/models'
import { GetNewPasswordRequest, PostSignUpRequest } from '../types/controllers'
import { LoginBody } from '../types/auth'
import { Nullable } from '../types/utilities'

dotenv.config()

type NewPasswordRequestBody = {
    userId: string
    password: string
    resetToken: string
}

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    })
)

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

export const getResetPasswordPage = (
    req: CustomRequest,
    res: Response
): void => {
    res.render('shop/reset-password', {
        title: 'Reset Password | Shops!',
        path: 'reset-password',
        errorMessage: getFlashErrorMessage(req)
    })
}

export const getNewPasswordPage = async (
    req: GetNewPasswordRequest,
    res: Response
): Promise<void> => {
    const { resetToken } = req.params
    console.log(resetToken)

    const user = await User.findOne({
        resetToken,
        resetTokenExpiration: { $gt: Date.now() }
    }).catch(err => console.error(err))

    if (user) {
        res.render('shop/new-password', {
            title: 'Reset Password | Shops!',
            path: 'reset-password',
            errorMessage: getFlashErrorMessage(req),
            userId: user._id,
            resetToken
        })
    } else {
        res.render('shop/reset-password', {
            title: 'Reset Password | Shops!',
            path: 'reset-password'
        })
    }
}

export const postLogin = async (
    req: RequestWithCustomSession<LoginBody>,
    res: Response
): Promise<void> => {
    const user = (await User.findOne({ email: req.body.email })) as DocumentUser

    if (user && !user.isSuspended && !user.isDeleted) {
        const isMatchPassword = await bcrypt
            .compare(req.body.password, user.password)
            .catch(err => {
                console.error(err)
                req.session.user = null
                req.flash('error', 'Invalid email or password.')
                res.redirect('/login')
            })

        if (isMatchPassword) {
            user.lastLoggedIn = Date.now()
            await user.save()

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
        if (err) {
            console.error(err)
        }
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

            await transporter
                .sendMail({
                    to: email,
                    from: process.env.SENDER_EMAIL_ADDRESS,
                    subject: 'Thank you for signing up to Shops!',
                    html: '<h1>You successfully signed up!!</h1>'
                })
                .catch(err => {
                    console.error(err)
                })

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

export const postResetPassword = (
    req: PostSignUpRequest,
    res: Response
): void => {
    crypto.randomBytes(32, (err, buffer): void => {
        if (err) {
            console.error(err)
            res.redirect('/reset-password')
        }

        const token = buffer.toString('hex')
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', `Email address couldn't find.`)
                    res.redirect('/reset-password')
                } else {
                    user.resetToken = token
                    user.resetTokenExpiration = Date.now() + 3600000
                    return user.save()
                }
            })
            .then(async () => {
                res.redirect('/login')

                await transporter
                    .sendMail({
                        to: req.body.email,
                        from: process.env.SENDER_EMAIL_ADDRESS,
                        subject: 'Shops! | Reset Password',
                        html: `<p>You requested a password reset.</p><p>Click this <a href="http://localhost:4000/new-password/${token}">link</a> to set a new password</p>`
                    })
                    .catch(err => {
                        console.error(err)
                    })
            })
            .catch(err => {
                console.error(err)
            })
    })
}

export const postNewPassword = async (
    req: CustomRequest<NewPasswordRequestBody>,
    res: Response
): Promise<void> => {
    const { password, userId, resetToken } = req.body

    const user = await User.findOne({
        _id: userId,
        resetToken,
        resetTokenExpiration: { $gt: Date.now() }
    }).catch(err => {
        console.error(err)
    })

    if (user) {
        const newPassword = await bcrypt
            .hash(password, 12)
            .catch(err => console.error(err))
        if (newPassword) {
            user.password = newPassword
            user.resetToken = null
            user.resetTokenExpiration = null

            await user.save()

            await transporter
                .sendMail({
                    to: user.email,
                    from: process.env.SENDER_EMAIL_ADDRESS,
                    subject: 'Successfully updated your password',
                    html: `<h1 style="font-size: 24px;">You successfully updated password.</h1><p><b>If you don't know anything about that, please contact support centre as soon as possible.</b></p>`
                })
                .catch(err => {
                    console.error(err)
                })

            res.redirect('/login')
        }
    }
}

export const postAdminSignup = async (
    req: PostSignUpRequest,
    res: Response
): Promise<void> => {
    const {
        email,
        confirmPassword,
        firstName,
        lastName,
        password,
        role
    } = req.body

    const editMode = req.body.editMode === 'true'
    const redirectPath = editMode ? '/admin/users' : '/admin/add-new-user'

    if (!email.length) {
        req.flash('error', 'Email address is empty')
        res.redirect(redirectPath)
    } else if (!(firstName.length && lastName.length)) {
        req.flash('error', 'First Name and/or Last Name is empty.')
        res.redirect(redirectPath)
    } else if (!editMode && !(password.length && confirmPassword.length)) {
        req.flash('error', 'Password is empty.')
        res.redirect(redirectPath)
    } else {
        const userDoc = await User.findOne({ email })

        console.log(userDoc)

        let hashPassword = await bcrypt.hash(password, 16).catch(err => {
            console.error(err)
            res.redirect('/admin/add-new-user')
        })
        let isValidPassword = false

        if (editMode) {
            if (password.length > 0) {
                isValidPassword = password === confirmPassword
            } else {
                isValidPassword = true

                if (userDoc) {
                    hashPassword = userDoc.password
                } else {
                    req.flash('error', 'User does not exit on Database.')
                    res.redirect(redirectPath)
                }
            }
        }

        let loggedInUser: Nullable<UserWithCart>
        if (req.session.user) {
            if (req.session.user._doc) {
                loggedInUser = req.session.user._doc
            } else {
                loggedInUser = req.session.user
            }
        } else {
            loggedInUser = null
        }

        if (!userDoc && isValidPassword) {
            const user = new User({
                email,
                password: hashPassword,
                first_name: firstName,
                last_name: lastName,
                role: role || 'admin',
                cart: { items: [] }
            })

            await user.save()
            req.session.user = user
            req.session.isLoggedIn = true

            const emailMessage = loggedInUser
                ? ` by ${loggedInUser.first_name} ${loggedInUser.last_name}`
                : ''

            await transporter
                .sendMail({
                    to: email,
                    from: process.env.SENDER_EMAIL_ADDRESS,
                    subject: 'You invited Shops admin',
                    html: `
<h1 style="font-size: 24px;">Hello ${user.first_name}!</h1>
<p>You invited to <a href="http://localhost:4000">Shops!</a>
admin${emailMessage}.</p>
<p>Temporary Password: <b>${password}</b></p>
<p>Please log in <a href="http://localhost:4000/login">here</a></p>
<p>Cheers!</p>
`
                })
                .catch(err => {
                    console.error(err)
                })

            res.redirect('/admin/users')
        } else if (!userDoc && !isValidPassword) {
            req.flash('error', 'Do not match passwords.')
            res.redirect('/admin/add-new-user')
        } else if (userDoc && isValidPassword && editMode) {
            userDoc.first_name = firstName
            userDoc.last_name = lastName
            userDoc.email = email
            userDoc.password = hashPassword || '123456'
            userDoc.role = role || 'admin'

            await userDoc.save()
            res.redirect('/admin/users')
        } else {
            req.flash('error', 'Email address has already been taken.')
            res.redirect('/admin/add-new-user')
        }
    }
}

export const postSuspendUser = async (
    req: Request<unknown, unknown, { id: string }, unknown>,
    res: Response
): Promise<void> => {
    console.log(req.body.id)
    const targetUser = await User.findOne({ _id: req.body.id }).catch(err => {
        console.error(err)
        res.redirect('/admin/users')
    })

    console.log(targetUser)

    if (targetUser) {
        targetUser.isSuspended = true
        await targetUser.save()
    }

    res.redirect('/admin/users')
}

export const postActivateUser = async (
    req: Request<unknown, unknown, { id: string }, unknown>,
    res: Response
): Promise<void> => {
    const targetUser = await User.findOne({ _id: req.body.id }).catch(err => {
        console.error(err)
        res.redirect('/admin/users')
    })

    if (targetUser) {
        targetUser.isSuspended = false
        await targetUser.save()
    }

    res.redirect('/admin/users')
}
