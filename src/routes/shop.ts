import express from 'express'
import { check, body } from 'express-validator/check'
import { PostProductRequest, PromiseController } from 'src/types/controllers'
import User from '../models/user'
import { authenticated } from '../middleware/authentication'
import {
    addItemToCart,
    deleteItemFromCart,
    getCartPage,
    PostItemToCart
} from '../controller/cart'
import {
    getCheckoutPage,
    getIndexPage,
    getOrdersPage,
    getProductDetailPage,
    postOrder
} from '../controller/shop'
import {
    getLoginPage,
    getNewPasswordPage,
    getResetPasswordPage,
    getSignUpPage,
    postLogin,
    postLogOut,
    postNewPassword,
    postResetPassword,
    postSignUp
} from '../controller/auth'

const router = express.Router()

router.get('/orders', authenticated, getOrdersPage as PromiseController)
router.get(
    '/shop/product/:productId',
    getProductDetailPage as PromiseController<PostProductRequest>
)

router.get('/cart', authenticated, getCartPage as PromiseController)
router.get('/cart/checkout', authenticated, getCheckoutPage)
router.get('/login', getLoginPage as PromiseController)
router.get('/signup', getSignUpPage as PromiseController)
router.get('/reset-password', getResetPasswordPage as PromiseController)
// eslint-disable-next-line
router.get('/new-password/:resetToken', getNewPasswordPage as any)
router.get('/', getIndexPage as PromiseController)

router.post('/cart', addItemToCart as PromiseController<PostItemToCart>)
router.post(
    '/cart/delete-product',
    deleteItemFromCart as PromiseController<PostItemToCart>
)
router.post('/order-products', authenticated, postOrder as PromiseController)
router.post(
    '/login',
    [check('email').isEmail().withMessage('Please enter valid email address.')],
    postLogin as PromiseController
)
router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Email address is empty')
            .custom(value => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject(
                                'Email address has already been taken.'
                            )
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        throw new Error(err)
                    })
            }),
        body(
            'password',
            'Please enter a password with only number and text and at least 5 characters.'
        )
            .isLength({ min: 6 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password does not match.')
            }
            return true
        })
    ],
    postSignUp as PromiseController
)
router.post('/logout', postLogOut as PromiseController)
router.post('/reset-password', postResetPassword as PromiseController)
// eslint-disable-next-line
router.post(
    '/new-password',
    [
        body(
            'password',
            'Please enter a password with only number and text and at least 5 characters.'
        )
            .isLength({ min: 6 })
            .isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password does not match.')
            }
            return true
        })
    ],
    postNewPassword as any
)

export default router
