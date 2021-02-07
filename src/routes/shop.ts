import express from 'express'
import { PostProductRequest, PromiseController } from 'src/types/controllers'
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
    getSignUpPage,
    postLogin,
    postLogOut,
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
router.get('/signup', getSignUpPage)
router.get('/', getIndexPage as PromiseController)

router.post('/cart', addItemToCart as PromiseController<PostItemToCart>)

router.post(
    '/cart/delete-product',
    deleteItemFromCart as PromiseController<PostItemToCart>
)

router.post('/order-products', authenticated, postOrder as PromiseController)
router.post('/login', postLogin as PromiseController)
router.post('/signup', postSignUp as PromiseController)
router.post('/logout', postLogOut as PromiseController)

export default router
