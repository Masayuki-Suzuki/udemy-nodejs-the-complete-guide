import express from 'express'
import { PromiseController } from 'src/types/controllers'
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
    getProductDetailPage
} from '../controller/shop'

const router = express.Router()

router.get('/shop/orders', getOrdersPage)
router.get('/shop/product/:productId', getProductDetailPage)
router.get('/cart', getCartPage as PromiseController)
router.get('/cart/checkout', getCheckoutPage)
router.get('/', getIndexPage as PromiseController)
router.post('/cart', addItemToCart as PromiseController<PostItemToCart>)
router.post(
    '/cart/delete-product',
    deleteItemFromCart as PromiseController<PostItemToCart>
)

export default router
