import express from 'express'
import { PostProductRequest, PromiseController } from 'src/types/controllers'
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
import { getLoginPage, postLogin } from '../controller/auth'

const router = express.Router()

router.get('/orders', getOrdersPage as PromiseController)
router.get(
    '/shop/product/:productId',
    getProductDetailPage as PromiseController<PostProductRequest>
)

router.get('/cart', getCartPage as PromiseController)
router.get('/cart/checkout', getCheckoutPage)
router.get('/login', getLoginPage as PromiseController)
router.get('/', getIndexPage as PromiseController)

router.post('/cart', addItemToCart as PromiseController<PostItemToCart>)

router.post(
    '/cart/delete-product',
    deleteItemFromCart as PromiseController<PostItemToCart>
)

router.post('/order-products', postOrder as PromiseController)
router.post('/login', postLogin as PromiseController)

export default router
